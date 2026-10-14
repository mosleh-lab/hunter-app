// Exercise library. kind: w = weight × reps, bw = bodyweight reps (optional added weight), t = minutes.
window.HUNTER_EXERCISES = [
  // صدر
  { id: 'bench', n: 'بنش برس بالبار', en: 'Barbell Bench Press', m: 'chest', kind: 'w' },
  { id: 'incline_bench', n: 'بنش عالي بالبار', en: 'Incline Barbell Press', m: 'chest', kind: 'w' },
  { id: 'db_bench', n: 'بنش دمبل', en: 'Dumbbell Bench Press', m: 'chest', kind: 'w' },
  { id: 'incline_db', n: 'بنش عالي دمبل', en: 'Incline Dumbbell Press', m: 'chest', kind: 'w' },
  { id: 'db_fly', n: 'تفتيح دمبل', en: 'Dumbbell Fly', m: 'chest', kind: 'w' },
  { id: 'cable_cross', n: 'كيبل كروس', en: 'Cable Crossover', m: 'chest', kind: 'w' },
  { id: 'chest_press_m', n: 'جهاز ضغط الصدر', en: 'Machine Chest Press', m: 'chest', kind: 'w' },
  { id: 'pec_deck', n: 'جهاز الفراشة', en: 'Pec Deck', m: 'chest', kind: 'w' },
  { id: 'pushup', n: 'ضغط', en: 'Push-up', m: 'chest', kind: 'bw' },
  { id: 'dips', n: 'متوازي', en: 'Dips', m: 'chest', kind: 'bw' },
  // ظهر
  { id: 'deadlift', n: 'ديدلفت', en: 'Deadlift', m: 'back', kind: 'w' },
  { id: 'pullup', n: 'عقلة', en: 'Pull-up', m: 'back', kind: 'bw' },
  { id: 'lat_pulldown', n: 'سحب أمامي', en: 'Lat Pulldown', m: 'back', kind: 'w' },
  { id: 'bb_row', n: 'تجديف بالبار', en: 'Barbell Row', m: 'back', kind: 'w' },
  { id: 'db_row', n: 'تجديف دمبل', en: 'Dumbbell Row', m: 'back', kind: 'w' },
  { id: 'seated_row', n: 'سحب أرضي', en: 'Seated Cable Row', m: 'back', kind: 'w' },
  { id: 'tbar_row', n: 'تجديف T-Bar', en: 'T-Bar Row', m: 'back', kind: 'w' },
  { id: 'straight_pulldown', n: 'سحب بذراع مستقيمة', en: 'Straight-Arm Pulldown', m: 'back', kind: 'w' },
  { id: 'face_pull', n: 'فيس بول', en: 'Face Pull', m: 'shoulders', kind: 'w' },
  { id: 'back_ext', n: 'ظهر سفلي (هايبر)', en: 'Back Extension', m: 'back', kind: 'bw' },
  // أكتاف
  { id: 'ohp', n: 'ضغط أكتاف بالبار', en: 'Overhead Press', m: 'shoulders', kind: 'w' },
  { id: 'db_shoulder', n: 'ضغط أكتاف دمبل', en: 'Dumbbell Shoulder Press', m: 'shoulders', kind: 'w' },
  { id: 'arnold', n: 'ضغط أرنولد', en: 'Arnold Press', m: 'shoulders', kind: 'w' },
  { id: 'lateral', n: 'رفرفة جانبي', en: 'Lateral Raise', m: 'shoulders', kind: 'w' },
  { id: 'front_raise', n: 'رفرفة أمامي', en: 'Front Raise', m: 'shoulders', kind: 'w' },
  { id: 'rear_delt', n: 'رفرفة خلفي', en: 'Rear Delt Fly', m: 'shoulders', kind: 'w' },
  { id: 'shrug', n: 'ترابيس', en: 'Shrug', m: 'shoulders', kind: 'w' },
  // أرجل
  { id: 'squat', n: 'سكوات بالبار', en: 'Back Squat', m: 'legs', kind: 'w' },
  { id: 'front_squat', n: 'سكوات أمامي', en: 'Front Squat', m: 'legs', kind: 'w' },
  { id: 'goblet', n: 'سكوات كأس (دمبل)', en: 'Goblet Squat', m: 'legs', kind: 'w' },
  { id: 'leg_press', n: 'دفع أرجل (ليق برس)', en: 'Leg Press', m: 'legs', kind: 'w' },
  { id: 'rdl', n: 'رومانيان ديدلفت', en: 'Romanian Deadlift', m: 'legs', kind: 'w' },
  { id: 'lunge', n: 'طعنات (لنجز)', en: 'Lunge', m: 'legs', kind: 'w' },
  { id: 'bulgarian', n: 'سكوات بلغاري', en: 'Bulgarian Split Squat', m: 'legs', kind: 'w' },
  { id: 'leg_ext', n: 'رفرفة أمامي (جهاز)', en: 'Leg Extension', m: 'legs', kind: 'w' },
  { id: 'leg_curl', n: 'رفرفة خلفي (جهاز)', en: 'Leg Curl', m: 'legs', kind: 'w' },
  { id: 'hip_thrust', n: 'هيب ثرست', en: 'Hip Thrust', m: 'legs', kind: 'w' },
  { id: 'calf', n: 'سمانة', en: 'Calf Raise', m: 'legs', kind: 'w' },
  // بايسبس
  { id: 'bb_curl', n: 'بايسبس بالبار', en: 'Barbell Curl', m: 'biceps', kind: 'w' },
  { id: 'db_curl', n: 'بايسبس دمبل', en: 'Dumbbell Curl', m: 'biceps', kind: 'w' },
  { id: 'hammer', n: 'هامر', en: 'Hammer Curl', m: 'biceps', kind: 'w' },
  { id: 'preacher', n: 'بايسبس ارتكاز (بريتشر)', en: 'Preacher Curl', m: 'biceps', kind: 'w' },
  { id: 'cable_curl', n: 'بايسبس كيبل', en: 'Cable Curl', m: 'biceps', kind: 'w' },
  // ترايسبس
  { id: 'pushdown', n: 'ترايسبس كيبل (بوش داون)', en: 'Triceps Pushdown', m: 'triceps', kind: 'w' },
  { id: 'oh_ext', n: 'ترايسبس خلف الرأس', en: 'Overhead Triceps Extension', m: 'triceps', kind: 'w' },
  { id: 'skull', n: 'سكل كراشر', en: 'Skull Crusher', m: 'triceps', kind: 'w' },
  { id: 'cg_bench', n: 'بنش قبضة ضيقة', en: 'Close-Grip Bench Press', m: 'triceps', kind: 'w' },
  // بطن
  { id: 'crunch', n: 'كرنش', en: 'Crunch', m: 'abs', kind: 'bw' },
  { id: 'plank', n: 'بلانك', en: 'Plank', m: 'abs', kind: 't' },
  { id: 'leg_raise', n: 'رفع أرجل', en: 'Leg Raise', m: 'abs', kind: 'bw' },
  { id: 'russian_twist', n: 'التواء روسي', en: 'Russian Twist', m: 'abs', kind: 'bw' },
  { id: 'cable_crunch', n: 'كرنش كيبل', en: 'Cable Crunch', m: 'abs', kind: 'w' },
  { id: 'ab_wheel', n: 'عجلة البطن', en: 'Ab Wheel', m: 'abs', kind: 'bw' },
  // كارديو
  { id: 'treadmill', n: 'جري على السير', en: 'Treadmill Run', m: 'cardio', kind: 't' },
  { id: 'incline_walk', n: 'مشي مائل', en: 'Incline Walk', m: 'cardio', kind: 't' },
  { id: 'bike', n: 'دراجة ثابتة', en: 'Stationary Bike', m: 'cardio', kind: 't' },
  { id: 'elliptical', n: 'أوربتراك', en: 'Elliptical', m: 'cardio', kind: 't' },
  { id: 'rower', n: 'جهاز التجديف', en: 'Rowing Machine', m: 'cardio', kind: 't' },
  { id: 'jump_rope', n: 'نط الحبل', en: 'Jump Rope', m: 'cardio', kind: 't' },
  { id: 'swim', n: 'سباحة', en: 'Swimming', m: 'cardio', kind: 't' },
  { id: 'hiit', n: 'تمارين هيت (HIIT)', en: 'HIIT', m: 'cardio', kind: 't' },
];
window.HUNTER_MUSCLES = { chest: 'صدر', back: 'ظهر', shoulders: 'أكتاف', legs: 'أرجل', biceps: 'بايسبس', triceps: 'ترايسبس', abs: 'بطن', cardio: 'كارديو' };
// Ready-made routines: each exercise is [id, sets, reps or minutes]
window.HUNTER_TEMPLATES = [
  { id: 'ppl', n: 'دفع / سحب / أرجل', routines: [
    { n: 'دفع (صدر، أكتاف، ترايسبس)', ex: [['bench', 4, '6-8'], ['incline_db', 3, '8-10'], ['ohp', 3, '8-10'], ['lateral', 3, '12-15'], ['pushdown', 3, '10-12'], ['oh_ext', 3, '10-12']] },
    { n: 'سحب (ظهر، بايسبس)', ex: [['deadlift', 3, '5'], ['lat_pulldown', 3, '8-10'], ['bb_row', 3, '8-10'], ['face_pull', 3, '12-15'], ['bb_curl', 3, '10-12'], ['hammer', 3, '10-12']] },
    { n: 'أرجل وبطن', ex: [['squat', 4, '6-8'], ['rdl', 3, '8-10'], ['leg_press', 3, '10-12'], ['leg_curl', 3, '10-12'], ['calf', 4, '12-15'], ['plank', 3, '1']] },
  ], days: [0, 1, 2, 4] },
  { id: 'ul', n: 'علوي / سفلي (4 أيام)', routines: [
    { n: 'علوي', ex: [['bench', 4, '6-8'], ['bb_row', 4, '6-8'], ['db_shoulder', 3, '8-10'], ['lat_pulldown', 3, '8-10'], ['db_curl', 3, '10-12'], ['pushdown', 3, '10-12']] },
    { n: 'سفلي', ex: [['squat', 4, '6-8'], ['rdl', 3, '8-10'], ['bulgarian', 3, '10'], ['leg_curl', 3, '10-12'], ['calf', 4, '12-15'], ['leg_raise', 3, '12-15']] },
  ], days: [0, 1, 3, 4] },
  { id: 'fb', n: 'جسم كامل (3 أيام)', routines: [
    { n: 'جسم كامل', ex: [['squat', 3, '8'], ['bench', 3, '8'], ['bb_row', 3, '8'], ['ohp', 3, '10'], ['rdl', 3, '10'], ['plank', 3, '1']] },
  ], days: [0, 2, 4] },
  { id: 'beginner', n: 'مبتدئ (أجهزة، 3 أيام)', routines: [
    { n: 'جسم كامل للمبتدئين', ex: [['leg_press', 3, '10-12'], ['chest_press_m', 3, '10-12'], ['lat_pulldown', 3, '10-12'], ['seated_row', 3, '10-12'], ['db_shoulder', 2, '10-12'], ['plank', 3, '1']] },
  ], days: [0, 2, 4] },
];
