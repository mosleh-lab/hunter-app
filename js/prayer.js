// Prayer times from sun position (PrayTimes.org algorithm). Pure functions, no network.
(function () {
  const DEG = Math.PI / 180;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG), tan = (d) => Math.tan(d * DEG);
  const asin = (x) => Math.asin(x) / DEG, acos = (x) => Math.acos(x) / DEG, atan2 = (y, x) => Math.atan2(y, x) / DEG, acot = (x) => Math.atan(1 / x) / DEG;
  const fixAngle = (a) => a - 360 * Math.floor(a / 360), fixHour = (a) => a - 24 * Math.floor(a / 24);

  // fajr/isha are sun depression angles; ishaMin means "minutes after maghrib" instead of an angle
  const METHODS = {
    uq: { name: 'أم القرى (السعودية)', fajr: 18.5, ishaMin: 90, ramadanIshaMin: 120 },
    mwl: { name: 'رابطة العالم الإسلامي', fajr: 18, isha: 17 },
    egypt: { name: 'الهيئة المصرية', fajr: 19.5, isha: 17.5 },
    kuwait: { name: 'الكويت', fajr: 18, isha: 17.5 },
    qatar: { name: 'قطر', fajr: 18, ishaMin: 90 },
    dubai: { name: 'الإمارات', fajr: 18.2, isha: 18.2 },
    karachi: { name: 'كراتشي', fajr: 18, isha: 18 },
    isna: { name: 'أمريكا الشمالية (ISNA)', fajr: 15, isha: 15 },
  };

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = fixAngle(357.529 + 0.98560028 * D), q = fixAngle(280.459 + 0.98564736 * D);
    const L = fixAngle(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
    const e = 23.439 - 0.00000036 * D;
    const RA = atan2(cos(e) * sin(L), cos(L)) / 15;
    return { decl: asin(sin(e) * sin(L)), eqt: q / 15 - fixHour(RA) };
  }

  // Returns {fajr, sunrise, dhuhr, asr, maghrib, isha} as Date instants for the given local calendar date.
  function compute(y, m, d, lat, lng, opts) {
    opts = opts || {};
    const method = METHODS[opts.method] || METHODS.uq;
    const asrFactor = opts.asr === 'hanafi' ? 2 : 1;
    const jDate = julian(y, m, d) - lng / (15 * 24);
    const midDay = (t) => fixHour(12 - sunPosition(jDate + t).eqt);
    const angleTime = (angle, t, ccw) => {
      const decl = sunPosition(jDate + t).decl, noon = midDay(t);
      const v = acos((-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat))) / 15;
      return noon + (ccw ? -v : v);
    };
    const asrTime = (t) => { const decl = sunPosition(jDate + t).decl; return angleTime(-acot(asrFactor + tan(Math.abs(lat - decl))), t); };
    let h = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, isha: 18 };
    for (let i = 0; i < 2; i++) {
      const p = Object.fromEntries(Object.entries(h).map(([k, v]) => [k, v / 24]));
      h = {
        fajr: angleTime(method.fajr, p.fajr, true),
        sunrise: angleTime(0.833, p.sunrise, true),
        dhuhr: midDay(p.dhuhr),
        asr: asrTime(p.asr),
        sunset: angleTime(0.833, p.sunset),
        isha: method.isha != null ? angleTime(method.isha, p.isha) : 18,
      };
    }
    let ishaMin = method.ishaMin;
    if (ishaMin != null && method.ramadanIshaMin && opts.ramadan) ishaMin = method.ramadanIshaMin;
    const times = { fajr: h.fajr, sunrise: h.sunrise, dhuhr: h.dhuhr, asr: h.asr, maghrib: h.sunset, isha: ishaMin != null ? h.sunset + ishaMin / 60 : h.isha };
    const base = Date.UTC(y, m - 1, d);
    const out = {};
    for (const k in times) {
      const utcH = times[k] - lng / 15;
      out[k] = isFinite(utcH) ? new Date(Math.round((base + utcH * 3600e3) / 60e3) * 60e3) : null;
    }
    return out;
  }

  window.PrayerTimes = { METHODS, compute };
})();
