// بيانات التوصيل: 4 مناطق حسب وصف صاحب المتجر
// المنطقة 1: الجزائر العاصمة فقط
// المنطقة 2: القريبة/الوسط/الشرق/الغرب (المدن الكبرى)
// المنطقة 3: الهضاب العليا والجنوب القريب
// المنطقة 4: أقصى الجنوب
// الأسعار هي متوسط كل نطاق "من...إلى" الذي أعطاه صاحب المتجر — يمكن تعديلها هنا فقط
const ZONE_PRICING = {
    1: { stopDesk: 250,  home: 450,  label: "الجزائر العاصمة" },
    2: { stopDesk: 400,  home: 600,  label: "قريبة / الوسط والشرق والغرب" },
    3: { stopDesk: 600,  home: 900,  label: "الهضاب العليا والجنوب القريب" },
    4: { stopDesk: 1200, home: 1200, label: "أقصى الجنوب" }
};

// قائمة الولايات الـ58 (بما فيها الولايات الجنوبية العشر الجديدة) مع رقم المنطقة
const WILAYAS = [
    { code: 1,  name: "أدرار", zone: 4 },
    { code: 2,  name: "الشلف", zone: 2 },
    { code: 3,  name: "الأغواط", zone: 3 },
    { code: 4,  name: "أم البواقي", zone: 2 },
    { code: 5,  name: "باتنة", zone: 2 },
    { code: 6,  name: "بجاية", zone: 2 },
    { code: 7,  name: "بسكرة", zone: 3 },
    { code: 8,  name: "بشار", zone: 3 },
    { code: 9,  name: "البليدة", zone: 2 },
    { code: 10, name: "البويرة", zone: 2 },
    { code: 11, name: "تمنراست", zone: 4 },
    { code: 12, name: "تبسة", zone: 2 },
    { code: 13, name: "تلمسان", zone: 2 },
    { code: 14, name: "تيارت", zone: 2 },
    { code: 15, name: "تيزي وزو", zone: 2 },
    { code: 16, name: "الجزائر العاصمة", zone: 1 },
    { code: 17, name: "الجلفة", zone: 3 },
    { code: 18, name: "جيجل", zone: 2 },
    { code: 19, name: "سطيف", zone: 2 },
    { code: 20, name: "سعيدة", zone: 2 },
    { code: 21, name: "سكيكدة", zone: 2 },
    { code: 22, name: "سيدي بلعباس", zone: 2 },
    { code: 23, name: "عنابة", zone: 2 },
    { code: 24, name: "قالمة", zone: 2 },
    { code: 25, name: "قسنطينة", zone: 2 },
    { code: 26, name: "المدية", zone: 2 },
    { code: 27, name: "مستغانم", zone: 2 },
    { code: 28, name: "المسيلة", zone: 3 },
    { code: 29, name: "معسكر", zone: 2 },
    { code: 30, name: "ورقلة", zone: 3 },
    { code: 31, name: "وهران", zone: 2 },
    { code: 32, name: "البيض", zone: 3 },
    { code: 33, name: "إليزي", zone: 4 },
    { code: 34, name: "برج بوعريريج", zone: 2 },
    { code: 35, name: "بومرداس", zone: 2 },
    { code: 36, name: "الطارف", zone: 2 },
    { code: 37, name: "تندوف", zone: 4 },
    { code: 38, name: "تيسمسيلت", zone: 2 },
    { code: 39, name: "الوادي", zone: 3 },
    { code: 40, name: "خنشلة", zone: 2 },
    { code: 41, name: "سوق أهراس", zone: 2 },
    { code: 42, name: "تيبازة", zone: 2 },
    { code: 43, name: "ميلة", zone: 2 },
    { code: 44, name: "عين الدفلى", zone: 2 },
    { code: 45, name: "النعامة", zone: 3 },
    { code: 46, name: "عين تموشنت", zone: 2 },
    { code: 47, name: "غرداية", zone: 3 },
    { code: 48, name: "غليزان", zone: 2 },
    { code: 49, name: "تيميمون", zone: 4 },
    { code: 50, name: "برج باجي مختار", zone: 4 },
    { code: 51, name: "أولاد جلال", zone: 3 },
    { code: 52, name: "بني عباس", zone: 4 },
    { code: 53, name: "عين صالح", zone: 4 },
    { code: 54, name: "عين قزام", zone: 4 },
    { code: 55, name: "تقرت", zone: 3 },
    { code: 56, name: "جانت", zone: 4 },
    { code: 57, name: "المغير", zone: 3 },
    { code: 58, name: "المنيعة", zone: 3 }
];
