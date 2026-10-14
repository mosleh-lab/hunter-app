import UIKit
import Capacitor
import HealthKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = AriseBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

// Registers the app's own native plugins with the Capacitor bridge.
class AriseBridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(AriseHealthPlugin())
    }

    override open func viewDidLoad() {
        super.viewDidLoad()
        // The app is dark, so the default (dark) scroll indicator is invisible.
        webView?.scrollView.indicatorStyle = .white
        webView?.scrollView.showsVerticalScrollIndicator = true
    }
}

// Reads one day of Apple Health data (steps, nutrition, water, sleep, weight).
// Apple Watch and Fitbit (via Google Health) both write into Apple Health, so one source covers all.
@objc(AriseHealthPlugin)
public class AriseHealthPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AriseHealthPlugin"
    public let jsName = "AriseHealth"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readDay", returnType: CAPPluginReturnPromise)
    ]

    private let store = HKHealthStore()

    private var sumTypes: [(String, HKQuantityTypeIdentifier, HKUnit)] {
        [
            ("steps", .stepCount, .count()),
            ("cal", .dietaryEnergyConsumed, .kilocalorie()),
            ("protein", .dietaryProtein, .gram()),
            ("carbs", .dietaryCarbohydrates, .gram()),
            ("fat", .dietaryFatTotal, .gram()),
            ("water", .dietaryWater, .liter()),
            ("active", .activeEnergyBurned, .kilocalorie())
        ]
    }

    private var readTypes: Set<HKObjectType> {
        var set = Set<HKObjectType>(sumTypes.compactMap { HKObjectType.quantityType(forIdentifier: $0.1) })
        if let w = HKObjectType.quantityType(forIdentifier: .bodyMass) { set.insert(w) }
        if let s = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) { set.insert(s) }
        return set
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": HKHealthStore.isHealthDataAvailable()])
    }

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("Health data is not available on this device")
            return
        }
        let entitled = Bundle.main.object(forInfoDictionaryKey: "NSHealthShareUsageDescription") != nil
        store.requestAuthorization(toShare: nil, read: readTypes) { ok, error in
            if let error = error {
                call.reject(error.localizedDescription, "\((error as NSError).code)")
            } else {
                call.resolve(["granted": ok, "entitled": entitled])
            }
        }
    }

    // readDay({ date: "YYYY-MM-DD" }) -> values for that local calendar day
    @objc func readDay(_ call: CAPPluginCall) {
        let fmt = DateFormatter()
        fmt.calendar = Calendar(identifier: .gregorian)
        fmt.locale = Locale(identifier: "en_US_POSIX")
        fmt.timeZone = TimeZone.current
        fmt.dateFormat = "yyyy-MM-dd"
        guard let dateStr = call.getString("date"), let start = fmt.date(from: dateStr) else {
            call.reject("Invalid date")
            return
        }
        let cal = Calendar.current
        let dayStart = cal.startOfDay(for: start)
        guard let dayEnd = cal.date(byAdding: .day, value: 1, to: dayStart) else {
            call.reject("Invalid date")
            return
        }

        var result: [String: Any] = ["date": dateStr]
        let lock = NSLock()
        let group = DispatchGroup()
        func put(_ key: String, _ value: Any) {
            lock.lock(); result[key] = value; lock.unlock()
        }

        let dayPredicate = HKQuery.predicateForSamples(withStart: dayStart, end: dayEnd, options: .strictStartDate)
        for (key, id, unit) in sumTypes {
            guard let type = HKQuantityType.quantityType(forIdentifier: id) else { continue }
            group.enter()
            // Statistics queries merge overlapping sources (iPhone + Watch) instead of double counting.
            let q = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: dayPredicate, options: .cumulativeSum) { _, stats, _ in
                if let v = stats?.sumQuantity()?.doubleValue(for: unit) { put(key, v) }
                group.leave()
            }
            store.execute(q)
        }

        // Weight: latest sample of the day.
        if let wType = HKQuantityType.quantityType(forIdentifier: .bodyMass) {
            group.enter()
            let sort = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
            let q = HKSampleQuery(sampleType: wType, predicate: dayPredicate, limit: 1, sortDescriptors: [sort]) { _, samples, _ in
                if let s = samples?.first as? HKQuantitySample {
                    put("weight", s.quantity.doubleValue(for: .gramUnit(with: .kilo)))
                }
                group.leave()
            }
            store.execute(q)
        }

        // Sleep: the night that ends on this day (asleep stages only, overlaps merged).
        if let sType = HKCategoryType.categoryType(forIdentifier: .sleepAnalysis),
           let from = cal.date(byAdding: .hour, value: -18, to: dayStart),
           let to = cal.date(byAdding: .hour, value: 14, to: dayStart) {
            group.enter()
            let pred = HKQuery.predicateForSamples(withStart: from, end: to, options: [])
            let q = HKSampleQuery(sampleType: sType, predicate: pred, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
                // 1 = asleep (legacy/unspecified), 3 = core, 4 = deep, 5 = REM. 0 = in bed, 2 = awake.
                let asleep: Set<Int> = [1, 3, 4, 5]
                var spans: [(Date, Date)] = (samples as? [HKCategorySample] ?? [])
                    .filter { asleep.contains($0.value) && $0.endDate > dayStart && $0.endDate <= to }
                    .map { ($0.startDate, $0.endDate) }
                    .sorted { $0.0 < $1.0 }
                var total: TimeInterval = 0
                if !spans.isEmpty {
                    var cur = spans.removeFirst()
                    for s in spans {
                        if s.0 <= cur.1 {
                            cur.1 = max(cur.1, s.1)
                        } else {
                            total += cur.1.timeIntervalSince(cur.0)
                            cur = s
                        }
                    }
                    total += cur.1.timeIntervalSince(cur.0)
                }
                if total > 0 { put("sleep", total / 3600.0) }
                group.leave()
            }
            store.execute(q)
        }

        group.notify(queue: .main) {
            call.resolve(result)
        }
    }
}
