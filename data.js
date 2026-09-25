// EcoSort O'yini uchun chiqindilar ma'lumotlar bazasi va ta'limiy faktlar
// Barcha ma'lumotlar o'zbek tilida, bolalar va maktab o'quvchilari uchun moslashtirilgan.

const WASTE_ITEMS = [
  {
    id: 1,
    name: "Plastik suv idishi (PET)",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle", // 'recycle' (o'ngga) yoki 'general' (chapga)
    typeTag: "Plastik",
    color: "#10b981",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><rect x="38" y="10" width="24" height="12" rx="3" fill="#0284c7"/><rect x="43" y="5" width="14" height="6" rx="2" fill="#38bdf8"/><path d="M32 26 C32 22, 40 22, 42 22 L58 22 C60 22, 68 22, 68 26 L72 45 C73 52, 68 55, 68 62 L68 85 C68 91, 62 95, 50 95 C38 95, 32 91, 32 85 L32 62 C32 55, 27 52, 28 45 Z" fill="#38bdf8" opacity="0.85"/><path d="M30 48 Q50 55 70 48 L71 60 Q50 67 29 60 Z" fill="#0284c7" opacity="0.6"/><ellipse cx="50" cy="54" rx="10" ry="2" fill="#bae6fd"/></svg>`,
    tip: "Yuvib, qopqog'ini yopib va siqib tashlang!",
    explanation: "Toza PET idishlar qayta ishlanib, yangi idishlar, sintetik kiyimlar va gilamlar tayyorlashda ishlatiladi.",
    funFact: "1 ta plastik shisha tabiatda 450 yilgacha parchalanmay yotishi mumkin!"
  },
  {
    id: 2,
    name: "Yog'li pitsa qutisi",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Aralash qog'oz",
    color: "#f59e0b",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><polygon points="50,15 90,40 50,65 10,40" fill="#f59e0b"/><polygon points="10,40 50,65 50,85 10,60" fill="#d97706"/><polygon points="90,40 50,65 50,85 90,60" fill="#b45309"/><circle cx="45" cy="42" r="5" fill="#ef4444"/><circle cx="58" cy="35" r="4" fill="#ef4444"/><circle cx="35" cy="33" r="3.5" fill="#ef4444"/><ellipse cx="52" cy="48" rx="12" ry="6" fill="#78350f" opacity="0.4"/></svg>`,
    tip: "Yog' tekkan qism qayta ishlanmaydi!",
    explanation: "Karton qutidagi yog' va pishloq qoldiqlari qog'ozni qayta ishlash mashinalarini ishdan chiqaradi. Faqat yog'siz qismini qirqib topshirish mumkin.",
    funFact: "Yog'li qog'oz qayta ishlash jarayonida suv bilan tolalarni ajratishga yo'l qo'ymaydi."
  },
  {
    id: 3,
    name: "Shisha sharbat shishasi",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Shisha",
    color: "#06b6d4",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><rect x="42" y="8" width="16" height="10" rx="2" fill="#d97706"/><path d="M38 22 C38 18, 42 18, 44 18 L56 18 C58 18, 62 18, 62 22 L65 38 C67 44, 70 48, 70 56 L70 86 C70 92, 65 96, 50 96 C35 96, 30 92, 30 86 L30 56 C30 48, 33 44, 35 38 Z" fill="#22d3ee" opacity="0.8"/><rect x="33" y="52" width="34" height="24" rx="4" fill="#f59e0b" opacity="0.9"/><circle cx="50" cy="64" r="6" fill="#fff" opacity="0.8"/></svg>`,
    tip: "Shisha idishlarni sindirmasdan topshiring!",
    explanation: "Shisha — tabiat uchun eng xavfsiz va 100% cheksiz marta qayta ishlanishi mumkin bo'lgan mo'jizaviy materialdir.",
    funFact: "1 ta shisha idishni qayta ishlash televizorni 20 daqiqa yoqib qo'yishga yetadigan elektrni tejaydi!"
  },
  {
    id: 4,
    name: "Ishlatilgan qog'oz salfetka",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Gigiyena qog'ozi",
    color: "#e11d48",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><path d="M25 45 C30 25, 65 20, 75 35 C85 50, 70 75, 65 80 C50 90, 30 85, 25 70 C20 55, 22 50, 25 45 Z" fill="#e2e8f0"/><path d="M35 50 Q50 40 65 52 Q50 65 35 50 Z" fill="#cbd5e1"/><ellipse cx="48" cy="55" rx="8" ry="4" fill="#94a3b8" opacity="0.5"/></svg>`,
    tip: "Salfetka va tualet qog'ozi qayta ishlanmaydi!",
    explanation: "Salfetkalar mayda va zaif tolalardan iborat bo'lib, ular nam va ifloslangan bo'ladi. Qog'oz zavodlarida qayta ishlanmaydi.",
    funFact: "Oddiy axlatga yoki kompostga (agar kimyoviy bo'yog'i bo'lmasa) tashlanishi lozim."
  },
  {
    id: 5,
    name: "Alyuminiy gazak bankasi",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Metall",
    color: "#6366f1",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><ellipse cx="50" cy="22" rx="22" ry="7" fill="#cbd5e1"/><rect x="28" y="22" width="44" height="58" fill="#ef4444"/><ellipse cx="50" cy="80" rx="22" ry="7" fill="#dc2626"/><ellipse cx="50" cy="22" rx="14" ry="4" fill="#94a3b8"/><path d="M35 38 L65 52 L65 62 L35 48 Z" fill="#ffffff" opacity="0.75"/></svg>`,
    tip: "Bankani oyoq bilan bosib, yassilab topshirish mumkin!",
    explanation: "Alyuminiy bankalar qayta ishlanib, 60 kundan keyin yana do'kon rastasiga yangi idish sifatida qaytadi.",
    funFact: "Alyuminiyni qayta ishlash yangisini rudasidan qazib olishga nisbatan 95% kamroq energiya sarflaydi!"
  },
  {
    id: 6,
    name: "Banan po'chog'i",
    category: "general",
    categoryLabel: "Umumiy chiqindi (Organik)",
    binType: "general",
    typeTag: "Organik chiqindi",
    color: "#eab308",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><path d="M25 80 C20 50, 45 25, 75 20 C76 22, 70 30, 60 40 C45 55, 35 70, 25 80 Z" fill="#facc15"/><path d="M75 20 C65 25, 45 45, 40 78 C35 75, 45 50, 75 20 Z" fill="#eab308"/><circle cx="75" cy="20" r="3" fill="#713f12"/><circle cx="38" cy="65" r="2.5" fill="#854d0e"/><circle cx="50" cy="45" r="2" fill="#854d0e"/></svg>`,
    tip: "Qayta ishlash qutisiga tashlamang, boshqa qog'ozlarni ifloslaydi!",
    explanation: "Banan po'chog'i organik chiqindi. U qayta ishlash (plastik/qog'oz) zavodiga tushmasligi kerak. Uni alohida kompost qilish eng yaxshisi.",
    funFact: "Banan po'sti tuproqda 2-4 haftada o'g'itga aylanadi."
  },
  {
    id: 7,
    name: "Toza karton quti",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Karton / Qog'oz",
    color: "#d97706",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><polygon points="50,15 88,32 50,50 12,32" fill="#d97706"/><polygon points="12,32 50,50 50,85 12,67" fill="#b45309"/><polygon points="88,32 50,50 50,85 88,67" fill="#92400e"/><line x1="50" y1="15" x2="50" y2="50" stroke="#fde68a" stroke-width="2" stroke-dasharray="3,3"/><path d="M30 45 L42 50 L42 65 L30 60 Z" fill="#fde68a" opacity="0.6"/></svg>`,
    tip: "Qutini yoyib, yassi shaklga keltiring!",
    explanation: "Toza gofrirovka qilingan karton eng oson va sifatli qayta ishlanadigan materiallardan biridir.",
    funFact: "1 tonna kartonni qayta ishlash 17 ta katta daraxtni kesilishdan saqlab qoladi!"
  },
  {
    id: 8,
    name: "Yaltiroq chipslar paketi",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Ko'p qatlamli folga",
    color: "#ec4899",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><rect x="25" y="20" width="50" height="65" rx="6" fill="#ec4899"/><polygon points="25,20 28,15 31,20 34,15 37,20 40,15 43,20 46,15 49,20 52,15 55,20 58,15 61,20 64,15 67,20 70,15 73,20 75,20" fill="#db2777"/><circle cx="50" cy="50" r="14" fill="#fde047"/><path d="M42 45 Q50 38 58 45" stroke="#b45309" stroke-width="3" fill="none"/></svg>`,
    tip: "Ichki qismi kumushsimon metall bo'lgan paketlar!",
    explanation: "Chipslar paketi plastik va alyuminiy folga qatlamlarining aralashmasidan tayyorlanadi. Ularni ajratish texnik jihatdan deyarli imkonsiz.",
    funFact: "Bunday paketlar qayta ishlanmaydi va oddiy maishiy chiqindilar qatoriga kiradi."
  },
  {
    id: 9,
    name: "Eski maktab daftari / Kitob",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Qog'oz / Makulatura",
    color: "#3b82f6",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><rect x="22" y="18" width="56" height="68" rx="4" fill="#3b82f6"/><rect x="20" y="20" width="8" height="64" rx="2" fill="#1d4ed8"/><line x1="36" y1="32" x2="68" y2="32" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/><line x1="36" y1="44" x2="68" y2="44" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/><line x1="36" y1="56" x2="60" y2="56" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/><line x1="36" y1="68" x2="52" y2="68" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/></svg>`,
    tip: "Skrepa yoki metall qisqichlarini ajratib oling!",
    explanation: "Toza daftarlar, qog'ozlar va kitoblar makulaturaga topshirilib, ulardan yangi daftarlar va darsliklar yasaladi.",
    funFact: "Qog'ozni 5-7 martagacha qayta-qayta yangi qog'oz mahsulotlariga aylantirish mumkin."
  },
  {
    id: 10,
    name: "Plastik bir martalik stakan",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Polistirol (PS-6)",
    color: "#64748b",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><polygon points="30,22 70,22 62,85 38,85" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/><ellipse cx="50" cy="22" rx="20" ry="5" fill="#e2e8f0"/><line x1="33" y1="40" x2="67" y2="40" stroke="#cbd5e1" stroke-width="2"/><line x1="35" y1="58" x2="65" y2="58" stroke="#cbd5e1" stroke-width="2"/></svg>`,
    tip: "Ko'p joylarda 6-raqamli polistirol qabul qilinmaydi!",
    explanation: "Bir martalik arzon oq qahva/choy stakanlari mo'rt plastmassadan yasalgan bo'lib, qayta ishlash tannarxi juda qimmat, shuning uchun umumiy axlatga boradi.",
    funFact: "Eng yaxshi yechim — maktabga shaxsiy ko'p martalik termos yoki idish olib borish!"
  },
  {
    id: 11,
    name: "Konserva temir bankasi",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Metall / Tunuka",
    color: "#059669",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><ellipse cx="50" cy="25" rx="24" ry="8" fill="#e2e8f0"/><rect x="26" y="25" width="48" height="50" fill="#94a3b8"/><ellipse cx="50" cy="75" rx="24" ry="8" fill="#64748b"/><line x1="26" y1="42" x2="74" y2="42" stroke="#475569" stroke-width="2"/><line x1="26" y1="58" x2="74" y2="58" stroke="#475569" stroke-width="2"/><circle cx="50" cy="25" r="4" fill="#cbd5e1"/></svg>`,
    tip: "Ichini suvda chayib, oziq-ovqat qoldiqlarini yuving!",
    explanation: "Konserva bankalari temir va qalaydan yasalgan. Metall cheksiz eritilib, yangi avtomobil, velosiped va jihozlarga aylanadi.",
    funFact: "Konserva bankasini eritish yangi temir rudasini eritishdan ko'ra 75% kam suv sarflaydi."
  },
  {
    id: 12,
    name: "Singan deraza oynasi bo'lagi",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Maxsus shisha",
    color: "#ef4444",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><polygon points="30,20 75,25 85,75 55,85 20,60" fill="#93c5fd" opacity="0.7"/><polygon points="40,35 65,30 55,65 35,55" fill="#60a5fa" opacity="0.6"/><line x1="50" y1="23" x2="55" y2="65" stroke="#ffffff" stroke-width="2"/><line x1="30" y1="45" x2="75" y2="60" stroke="#ffffff" stroke-width="2"/></svg>`,
    tip: "Xavfsiz qilib gazetaga o'rab umumiy axlatga tashlang!",
    explanation: "Deraza oynalari, ko'zoynaklar va billur shishalarning erish harorati oddiy shisha idishlarnikidan butunlay farq qiladi, shuning uchun qayta ishlashga qo'shilmaydi.",
    funFact: "Singan deraza shishasi butun partiya qayta ishlanadigan shishalarni yaroqsiz qilishi mumkin."
  },
  {
    id: 13,
    name: "Polietilen paket (Bozor xaltasi)",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Plastik plyonka (LDPE)",
    color: "#14b8a6",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><path d="M30 40 C30 25, 42 20, 50 20 C58 20, 70 25, 70 40 L76 80 C76 88, 70 92, 50 92 C30 92, 24 88, 24 80 Z" fill="#99f6e4" stroke="#0d9488" stroke-width="2"/><path d="M40 35 C40 28, 45 28, 50 28 C55 28, 60 28, 60 35 L60 48 L40 48 Z" fill="#ffffff" stroke="#0d9488" stroke-width="2"/></svg>`,
    tip: "Toza va quruq holda plastik qabul qilish punktiga topshiring!",
    explanation: "Toza polietilen paketlar granula qilib eritilib, yangi chiqindi xaltalari va quvurlar yasashda ishlatiladi.",
    funFact: "Bitta matoli xarid xaltasi yiliga 500 dan ortiq bir martalik paket o'rnini bosadi!"
  },
  {
    id: 14,
    name: "Plastik tish cho'tkasi",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Aralash plastik",
    color: "#8b5cf6",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><rect x="46" y="35" width="8" height="55" rx="4" fill="#a78bfa"/><path d="M44 15 C44 12, 56 12, 56 15 L56 35 L44 35 Z" fill="#7c3aed"/><rect x="56" y="16" width="14" height="4" fill="#38bdf8"/><rect x="56" y="22" width="14" height="4" fill="#38bdf8"/><rect x="56" y="28" width="14" height="4" fill="#38bdf8"/></svg>`,
    tip: "Bir necha xil aralash plastmassadan tayyorlangan!",
    explanation: "Tish cho'tkasi qattiq dastak, rezina tutqich va neylon tuklardan iborat. Bu materiallarni bir-biridan ajratish imkonsiz, shuning uchun qayta ishlanmaydi.",
    funFact: "Eko-variant: Bambukdan yasalgan biologik parchalanuvchi tish cho'tkalaridan foydalaning!"
  },
  {
    id: 15,
    name: "Shampun / Gel flakoni (HDPE)",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Plastik (HDPE-2)",
    color: "#0284c7",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><rect x="42" y="12" width="16" height="12" rx="3" fill="#0284c7"/><path d="M30 30 C30 24, 40 24, 50 24 C60 24, 70 24, 70 30 L74 82 C74 90, 65 94, 50 94 C35 94, 26 90, 26 82 Z" fill="#38bdf8"/><rect x="34" y="44" width="32" height="30" rx="4" fill="#ffffff" opacity="0.9"/><circle cx="50" cy="59" r="6" fill="#0284c7"/></svg>`,
    tip: "Ichidagi ko'pikni chayib tashlang!",
    explanation: "HDPE (2-toifali plastik) juda qalin va sifatli polimer. Qayta ishlash korxonalari buni mamnuniyat bilan sotib oladi.",
    funFact: "HDPE plastmassasidan mustahkam bolalar maydonchalari va o'rindiqlar yasaladi."
  },
  {
    id: 16,
    name: "Eski cho'g'lanma lampochka",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Aralash shisha/metall",
    color: "#f97316",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><circle cx="50" cy="40" r="24" fill="#fed7aa" stroke="#fb923c" stroke-width="2"/><rect x="42" y="64" width="16" height="14" fill="#94a3b8"/><ellipse cx="50" cy="78" rx="8" ry="3" fill="#64748b"/><path d="M44 45 L48 30 L52 45" stroke="#ea580c" stroke-width="2" fill="none"/></svg>`,
    tip: "Oddiy cho'g'lanma lampalarda ingichka volfram simi bor!",
    explanation: "Oddiy cho'g'lanma lampochkalar qayta ishlanmaydigan mayda aralash metalldan iborat bo'lib, umumiy axlatga xavfsiz o'ralib tashlanadi.",
    funFact: "Lyuminessent (simobli) lampalarni esa aslo umumiy axlatga tashlamang — ular xavfli chiqindi hisoblanadi!"
  },
  {
    id: 17,
    name: "Yaltiroq jurnal / Reklama bukleti",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Qog'oz / Makulatura",
    color: "#84cc16",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><polygon points="25,20 75,15 85,80 35,85" fill="#a3e635"/><polygon points="20,22 70,17 78,82 28,87" fill="#65a30d"/><rect x="34" y="32" width="30" height="20" fill="#ffffff" opacity="0.8"/><line x1="34" y1="60" x2="68" y2="58" stroke="#ffffff" stroke-width="3"/></svg>`,
    tip: "Polietilen o'ramini olib tashlang!",
    explanation: "Ko'pchilik yaltiroq jurnallar qayta ishlanmaydi deb o'ylaydi, ammo zamonaviy texnologiyalar ularni a'lo darajada qayta ishlaydi.",
    funFact: "Makulaturani yig'ish millionlab daraxtlarni saqlab qolishning eng oddiy yo'li!"
  },
  {
    id: 18,
    name: "Keramika kosa sinig'i",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Kulolchilik / Tosh buyum",
    color: "#a855f7",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><path d="M22 40 Q50 35 78 40 Q70 80 50 82 Q30 80 22 40 Z" fill="#e9d5ff" stroke="#a855f7" stroke-width="2"/><line x1="45" y1="40" x2="52" y2="80" stroke="#7e22ce" stroke-width="2"/><line x1="35" y1="55" x2="65" y2="60" stroke="#7e22ce" stroke-width="2"/></svg>`,
    tip: "Shisha idishlar bilan birga topshirib bo'lmaydi!",
    explanation: "Keramika, sopol va chinni mahsulotlari shisha emas. Ular butunlay boshqa minerallardan pishirilgan va shisha eritish pechlarida erimaydi.",
    funFact: "Sopol va keramika sinig'i umumiy chiqindiga yoki qurilish toshlari orasiga tashlanadi."
  },
  {
    id: 19,
    name: "Yumurta qutisi (Karton)",
    category: "recyclable",
    categoryLabel: "Qayta ishlanadigan",
    binType: "recycle",
    typeTag: "Karton / Qolipli tola",
    color: "#eab308",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><rect x="18" y="35" width="64" height="42" rx="6" fill="#fde047" stroke="#ca8a04" stroke-width="2"/><ellipse cx="32" cy="46" rx="8" ry="6" fill="#fef08a"/><ellipse cx="50" cy="46" rx="8" ry="6" fill="#fef08a"/><ellipse cx="68" cy="46" rx="8" ry="6" fill="#fef08a"/></svg>`,
    tip: "Toza va quruq bo'lsa qayta ishlanadi yoki kompost qilinadi!",
    explanation: "Tuxum qutilari qayta ishlangan qog'oz pulpasidan tayyorlanadi. Ular toza bo'lsa qayta ishlanadi, shuningdek tuproqda tez parchalanadi.",
    funFact: "Bunday kartonni xona o'simliklari tagiga solish orqali namlikni saqlash mumkin."
  },
  {
    id: 20,
    name: "Polistirol penoplast bo'lagi",
    category: "general",
    categoryLabel: "Umumiy chiqindi",
    binType: "general",
    typeTag: "Penoplast (PS-6)",
    color: "#94a3b8",
    iconSvg: `<svg viewBox="0 0 100 100" class="waste-svg"><polygon points="20,40 50,20 80,40 50,60" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/><polygon points="20,40 50,60 50,85 20,65" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/><polygon points="80,40 50,60 50,85 80,65" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/><circle cx="40" cy="45" r="2" fill="#94a3b8"/><circle cx="60" cy="50" r="2" fill="#94a3b8"/></svg>`,
    tip: "98% havodan iborat, tashish va qayta ishlash juda qiyin!",
    explanation: "Penoplast maydalanib, butun atrof-muhitga tarqaladi. Uni qayta ishlash infratuzilmasi ko'p joyda yo'q, shuning uchun umumiy axlat qutisiga solinadi.",
    funFact: "Penoplast tabiatda 500 yildan ortiq saqlanib qolishi mumkin."
  }
];

// ================= 1-5 SINFLAR UCHUN ECO-LEVEL TIZIMI (STARTER -> LEGEND) =================
const LEVEL_DEFINITIONS = [
  {
    id: 'starter',
    tier: 1,
    name: 'Starter',
    uzTitle: "Boshlovchi Eko-Do'st",
    minScore: 0,
    maxScore: 200,
    badgeIcon: '🌱',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 78, 59, 0.4))',
    borderColor: '#10b981',
    desc: "Ekologiya dunyosiga ilk qadam! Chiqindilarni saralash asoslarini o'rganmoqda.",
    rewardNote: "Yashil Novda Nishoni",
    forGrades: "1-sinf uchun mos"
  },
  {
    id: 'explorer',
    tier: 2,
    name: 'Explorer',
    uzTitle: 'Tabiat Izquvari',
    minScore: 201,
    maxScore: 500,
    badgeIcon: '🌿',
    color: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(14, 116, 144, 0.4))',
    borderColor: '#06b6d4',
    desc: "Atrof-muhitni o'rganuvchi faol o'quvchi. Qayta ishlash qoidalarini yaxshi biladi.",
    rewardNote: 'Zangori Barg Nishoni',
    forGrades: '2-sinf darajasi'
  },
  {
    id: 'guard',
    tier: 3,
    name: 'Eco Guard',
    uzTitle: 'Yashil Soqchi',
    minScore: 501,
    maxScore: 1000,
    badgeIcon: '🌳',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(4, 120, 87, 0.4))',
    borderColor: '#059669',
    desc: "Maktab va uyda tozalikni himoya qiluvchi, sinfdoshlariga o'rnak bo'luvchi soqchi.",
    rewardNote: "O'rmon Qo'riqchisi Medali",
    forGrades: '3-sinf darajasi'
  },
  {
    id: 'ranger',
    tier: 4,
    name: 'Eco Ranger',
    uzTitle: 'Saralash Ustasi',
    minScore: 1001,
    maxScore: 1800,
    badgeIcon: '⚡',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(29, 78, 216, 0.4))',
    borderColor: '#3b82f6',
    desc: "Chiqindilarni tezkor va xatosiz saralay oluvchi chaqqon eko-reynjer.",
    rewardNote: 'Chaqmoq Eko-Nishoni',
    forGrades: '4-sinf chempioni'
  },
  {
    id: 'master',
    tier: 5,
    name: 'Eco Master',
    uzTitle: 'Eko Master',
    minScore: 1801,
    maxScore: 3000,
    badgeIcon: '💎',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(109, 40, 217, 0.4))',
    borderColor: '#8b5cf6',
    desc: "Barcha chiqindi turlari, xavfli moddalar va qayta ishlash sirlarini mukammal egallagan usta.",
    rewardNote: 'Olmos Eko-Ordeni',
    forGrades: '5-sinf yetakchisi'
  },
  {
    id: 'legend',
    tier: 6,
    name: 'Legend',
    uzTitle: 'Eko Afsona',
    minScore: 3001,
    maxScore: 99999,
    badgeIcon: '👑',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(180, 83, 9, 0.5))',
    borderColor: '#f59e0b',
    desc: "Eng yuqori cho'qqi! Respublika maktablari orasida yetakchi afsonaviy eko-qahramon!",
    rewardNote: "Oltin Toj & Shon-sharaf Doskasi",
    forGrades: "1-5 sinflarning faxri"
  }
];

// Helper: Ballga qarab Levelni aniqlash
function getLevelByScore(score) {
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (score >= LEVEL_DEFINITIONS[i].minScore) {
      return LEVEL_DEFINITIONS[i];
    }
  }
  return LEVEL_DEFINITIONS[0];
}

// Helper: Keyingi levelgacha qolgan ma'lumotlar
function getNextLevelInfo(score) {
  const current = getLevelByScore(score);
  const currentIdx = LEVEL_DEFINITIONS.findIndex(l => l.id === current.id);
  if (currentIdx < LEVEL_DEFINITIONS.length - 1) {
    const next = LEVEL_DEFINITIONS[currentIdx + 1];
    const needed = next.minScore - score;
    const range = next.minScore - current.minScore;
    const progress = Math.min(100, Math.max(0, Math.round(((score - current.minScore) / range) * 100)));
    return { next, needed, progress, isMax: false };
  }
  return { next: null, needed: 0, progress: 100, isMax: true };
}

// ================= BOLALAR UCHUN VIDEO DARSLIKLAR VA TESTLAR =================
const VIDEO_LESSONS = [
  {
    id: 1,
    title: "Chiqindilarni Nega Saralashimiz Kerak?",
    category: "nature",
    gradeText: "1-3 sinflar uchun",
    grades: [1, 2, 3],
    duration: "3 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Animatsiya",
    color: "#10b981",
    youtubeId: "OasbYWF4_S8",
    embedUrl: "https://www.youtube-nocookie.com/embed/OasbYWF4_S8?rel=0",
    summary: "Bolalar uchun qiziqarli animatsion darslik. Tabiatni axlatdan qutqarish, toza havo va suvni saqlash sirlari.",
    learningGoals: [
      "Plastik va qog'oz chiqindilarining farqi",
      "Axlatxonalarning tabiatga zarari",
      "Uyda va maktabda oddiy saralash qoidalari"
    ],
    quiz: [
      {
        question: "Chiqindilarni to'g'ri saralash tabiatga qanday yordam beradi?",
        options: [
          "Daraxtlar va daryolarni asraydi, yangi buyumlar yasashga xomashyo beradi",
          "Faqat axlatxonalarni kattalashtiradi",
          "Hech qanday foydasi yo'q"
        ],
        correct: 0,
        explanation: "To'g'ri! Chiqindilar qayta ishlansa, yangi daraxtlar kesilmaydi va tabiat ifloslanmaydi."
      },
      {
        question: "1 dona plastik shisha tabiatda necha yil parchalanmay yotishi mumkin?",
        options: [
          "Atigi 2 hafta",
          "400 yildan ortiq vaqt!",
          "Faqat 1 oy"
        ],
        correct: 1,
        explanation: "Barakalla! Plastik shishalar 400-450 yilgacha parchalanmay tabiatni zaharlaydi."
      },
      {
        question: "Eski daftar va kitoblarni qaysi qutiga tashlash kerak?",
        options: [
          "Suv ariqlariga",
          "Qayta ishlanadigan qog'oz (makulatura) qutisiga",
          "Yog'li ovqatlar solinadigan idishga"
        ],
        correct: 1,
        explanation: "Ajoyib! Qog'ozlar qayta ishlanib yangi kitob va daftarlarga aylanadi."
      }
    ]
  },
  {
    id: 2,
    title: "Plastik Idishlar Sarguzashti: Qayta Ishlash Mo'jizasi",
    category: "plastic",
    gradeText: "1-5 sinflar uchun",
    grades: [1, 2, 3, 4, 5],
    duration: "4 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Eko-Tadqiqot",
    color: "#06b6d4",
    youtubeId: "VlRVPum9cp4",
    embedUrl: "https://www.youtube-nocookie.com/embed/VlRVPum9cp4?rel=0",
    summary: "Plastik suv idishlari zavodlarda qanday yuviladi, maydalanadi va yangi kiyim hamda o'rindiqlarga aylanadi?",
    learningGoals: [
      "PET (1) va HDPE (2) toza plastik belgilari",
      "Plastik idishni tashlashdan oldin siqish qoidasi",
      "Bir martalik plastikdan voz kechish usullari"
    ],
    quiz: [
      {
        question: "Plastik shishani qayta ishlash qutisiga tashlashdan oldin nima qilish eng to'g'ri?",
        options: [
          "Suvda chayib, siqib yassilash lozim",
          "Ichiga loy yoki qum to'ldirish kerak",
          "Olovda eritib yuborish lozim"
        ],
        correct: 0,
        explanation: "To'ppa-to'g'ri! Idish siqilsa, qutida kamroq joy egallaydi va toza bo'lsa sifatli qayta ishlanadi."
      },
      {
        question: "Qayta ishlangan sifatli plastikdan nimalar tayyorlash mumkin?",
        options: [
          "Yangi idishlar, sintetik kiyimlar, bolalar maydonchalari",
          "Shirinlik va pechenyelar",
          "Hech narsa yasab bo'lmaydi"
        ],
        correct: 0,
        explanation: "Ofarin! Qayta ishlangan polimerdan iliq kurtkalar, yangi quvurlar va o'yin maydonchalari yasaladi."
      },
      {
        question: "Har kuni maktabga suv ichish uchun nima olib borgan ma'qul?",
        options: [
          "Har kuni yangi bir martalik plastik idish sotib olish",
          "Shaxsiy ko'p martalik chiroyli termos yoki eko-idish",
          "Umuman suv ichmaslik"
        ],
        correct: 1,
        explanation: "Ajoyib tanlov! Ko'p martalik idish yuzlab bir martalik plastik chiqindining oldini oladi."
      }
    ]
  },
  {
    id: 3,
    title: "Daraxtlarni Qutqaramiz: Qog'oz va Makulatura Sirlari",
    category: "paper",
    gradeText: "1-5 sinflar uchun",
    grades: [1, 2, 3, 4, 5],
    duration: "4 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "O'rmon Do'sti",
    color: "#059669",
    youtubeId: "-01T9e6VDWU",
    embedUrl: "https://www.youtube-nocookie.com/embed/-01T9e6VDWU?rel=0",
    summary: "Har bir eski daftar daraxtlarni saqlab qolishi mumkin. Makulaturani to'g'ri yig'ish va qog'ozni qayta ishlash sirlari.",
    learningGoals: [
      "1 tonna qog'oz = 17 ta kesilmagan yashil daraxt",
      "Qog'oz tolalari 5-7 martagacha yangi qog'oz bo'lishi",
      "Yog'li pitsa qutisi nima uchun qayta ishlanmasligi"
    ],
    quiz: [
      {
        question: "Taxminan 60 kg makulatura qog'ozi yig'ilsa, nechta katta daraxt saqlab qolinadi?",
        options: [
          "1 ta katta va yashil daraxt",
          "0 ta daraxt",
          "Faqat 1 ta barg"
        ],
        correct: 0,
        explanation: "To'g'ri! Har 60 kg qog'oz bitta tirik daraxtning kesilishiga to'sqinlik qiladi."
      },
      {
        question: "Yog' tekkan pitsa qutisi nima sababdan qog'oz zavodida qayta ishlanmaydi?",
        options: [
          "Chunki yog' qog'oz tolalari suvda erishiga yo'l qo'ymaydi va uskunani buzadi",
          "Chunki quti juda chiroyli",
          "Chunki u qog'oz emas, temirdan yasalgan"
        ],
        correct: 0,
        explanation: "Ofarin! Yog'li qog'ozni umumiy axlatga tashlash yoki faqat toza qismini qirqib olish kerak."
      },
      {
        question: "Qog'ozni necha martagacha qayta-qayta yangi qog'ozga aylantirish mumkin?",
        options: [
          "Faqat 1 marta",
          "5 martadan 7 martagacha!",
          "Hech qachon qayta ishlanmaydi"
        ],
        correct: 1,
        explanation: "To'g'ri! Qog'oz tolalari 5-7 martagacha yangi mahsulotga aylanib xizmat qiladi."
      }
    ]
  },
  {
    id: 4,
    title: "Xavfli Chiqindilar: Batareya va Elektron Chiqindilar",
    category: "battery",
    gradeText: "3-5 sinflar uchun",
    grades: [3, 4, 5],
    duration: "4 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Eko-Xavfsizlik",
    color: "#f59e0b",
    youtubeId: "MQLadfsvfLo",
    embedUrl: "https://www.youtube-nocookie.com/embed/MQLadfsvfLo?rel=0",
    summary: "O'yinchoq pultlari batareyasi va eski telefonlardagi og'ir metallar. Ularni nima uchun alohida qutiga yig'ish shart?",
    learningGoals: [
      "1 dona batareya = 20 kv.m yer yoki 400 litr toza suv zarari",
      "Simob va qo'rg'oshin kabi og'ir moddalar xavfi",
      "Maktabda batareya yig'ish qutisi yasash qoidalari"
    ],
    quiz: [
      {
        question: "1 dona kichik ishlatilgan batareya qancha maydonni yoki suvni zaharlashi mumkin?",
        options: [
          "20 kvadrat metr yer yoki 400 litr suvni",
          "Faqat 1 tomchi suvni",
          "Batareya hech qanday zarar keltirmaydi"
        ],
        correct: 0,
        explanation: "To'g'ri! Batareya ichidagi og'ir metallar yomg'ir suvi bilan yer osti suvlariga singib ketadi."
      },
      {
        question: "Uyda yoki sinfda ishlatib bo'lingan batareyani qayerga tashlash lozim?",
        options: [
          "Maxsus batareya qutisiga yoki qabul qilish punktiga",
          "Hovlidagi ariqqa",
          "Oddiy uy axlat paqiriga"
        ],
        correct: 0,
        explanation: "Barakalla! Batareyalarni alohida maxsus idishda to'plab topshirish kerak."
      },
      {
        question: "Eski simobli termometr yoki lampochka sinsa nima qilish kerak?",
        options: [
          "Kattalarga aytib, xonani shamollatish va maxsus ehtiyotkorlik bilan yig'ish",
          "Qo'l bilan ushlab o'ynash",
          "Gilam tagiga supurib qo'yish"
        ],
        correct: 0,
        explanation: "Juda to'g'ri! Simob o'ta zaharli moddadir, uni faqat kattalar maxsus qoidaga ko'ra tozalaydi."
      }
    ]
  },
  {
    id: 5,
    title: "Dengiz va Okeanlar: Plastik Ifloslanishiga Chek Qo'yamiz",
    category: "plastic",
    gradeText: "1-5 sinflar uchun",
    grades: [1, 2, 3, 4, 5],
    duration: "5 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Okean Qo'riqchisi",
    color: "#0284c7",
    youtubeId: "ODni_Bey154",
    embedUrl: "https://www.youtube-nocookie.com/embed/ODni_Bey154?rel=0",
    summary: "Daryolar orqali dengizga yetib borgan axlatlar toshbaqalar va kitlarga qanday zarar keltiradi? Mikroplastik xavfi.",
    learningGoals: [
      "Plastik paketlar va somonchalarning dengiz jonzotlariga zarari",
      "Mikroplastiklar suv havzalariga qanday tushishi",
      "Bir martalik plastiklar o'rniga matoli xarid xaltalaridan foydalanish"
    ],
    quiz: [
      {
        question: "Dengiz toshbaqalari ko'pincha suvda suzib yurgan plastik paketlarni nima deb o'ylab yutib yuboradi?",
        options: [
          "O'zining sevimli ozuqasi — meduza deb",
          "Katta tosh deb",
          "Muz bo'lagi deb"
        ],
        correct: 0,
        explanation: "Afsuski, shunday! Suvdagi shaffof paketlar meduzaga juda o'xshaydi va jonzotlarni nobud qiladi."
      },
      {
        question: "Mikroplastik nima degani?",
        options: [
          "Quyosh va to'lqinlar ta'sirida maydalanib ketgan ko'zga arang ko'rinadigan plastik zarrachalari",
          "Kichik o'yinchoq robotlar",
          "Dengizdagi toza marvaridlar"
        ],
        correct: 0,
        explanation: "To'g'ri! Mayda mikroplastik zarrachalari suv va baliqlar orqali inson tanasiga ham yetib boradi."
      },
      {
        question: "Do'konga borganda har gal yangi polietilen paket olmaslik uchun nima qilish kerak?",
        options: [
          "Uyda doimiy ko'p martalik chiroyli eko-sumka (shoper) olib yurish",
          "Xaridlarni yerga sochib olib ketish",
          "Hech narsa xarid qilmaslik"
        ],
        correct: 0,
        explanation: "Barakalla! Eko-sumka har yili yuzlab ortiqcha paketlarning tabiatga tushishini to'xtatadi."
      }
    ]
  },
  {
    id: 6,
    title: "Agar Qayta Ishlash To'xtasa Nima Bo'ladi? Eko-Falokat",
    category: "nature",
    gradeText: "2-5 sinflar uchun",
    grades: [2, 3, 4, 5],
    duration: "4 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Sayyora Kelajagi",
    color: "#8b5cf6",
    youtubeId: "EyLJ4158Y3s",
    embedUrl: "https://www.youtube-nocookie.com/embed/EyLJ4158Y3s?rel=0",
    summary: "Tasavvur qiling: insoniyat axlat saralashni to'xtatsa, 1 yilda shaharlarimiz qanday axlat tog'lariga ko'milib qoladi?",
    learningGoals: [
      "Chiqindixonalar (poligonlar) maydonining cheklanganligi",
      "Zaharli metan gazi va yer osti suvlarining ifloslanishi",
      "Har bir bolaning chiqindilarni kamaytirishdagi o'rni"
    ],
    quiz: [
      {
        question: "Agar butun dunyoda chiqindilarni qayta ishlash to'xtatilsa, qanday muammo yuzaga keladi?",
        options: [
          "Shaharlar atrofida ulkan zaharli axlat tog'lari hosil bo'ladi va havo buziladi",
          "Tabiat yanada yashillashib ketadi",
          "Hech qanday o'zgarish bo'lmaydi"
        ],
        correct: 0,
        explanation: "To'g'ri! Poligonlar to'lib, zaharli moddalar tuproq va havoni yaroqsiz holga keltiradi."
      },
      {
        question: "Chiqindilarni ochiq havoda yoqish nima uchun qat'iyan taqiqlanadi?",
        options: [
          "Chunki u havoga zaharli dioksin va tutun tarqatib o'pka kasalliklarini keltirib chiqaradi",
          "Chunki tutun juda chiroyli",
          "Chunki olov juda salqin bo'ladi"
        ],
        correct: 0,
        explanation: "Ofarin! Chiqindini yoqish inson salomatligi va atmosferaga juda katta ziyon yetkazadi."
      },
      {
        question: "Eko-qahramon bo'lish uchun o'quvchi birinchi navbatda nima qilishi kerak?",
        options: [
          "O'z xonasida va maktabida chiqindilarni saralab tashlash odatini yo'lga qo'yishi lozim",
          "Chiqindini derazadan ko'chaga uloqtirishi kerak",
          "Kattalarga xalaqit berishi lozim"
        ],
        correct: 0,
        explanation: "Ajoyib javob! Har bir ezgu o'zgarish o'zimizdan va oddiy saralashdan boshlanadi."
      }
    ]
  },
  {
    id: 7,
    title: "Oltin Qoida: 3R — Kamaytirish, Qayta Ishlatish, Saralash",
    category: "nature",
    gradeText: "1-4 sinflar uchun",
    grades: [1, 2, 3, 4],
    duration: "3 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "3R Metodi",
    color: "#10b981",
    youtubeId: "6jQ7y_qQYUA",
    embedUrl: "https://www.youtube-nocookie.com/embed/6jQ7y_qQYUA?rel=0",
    summary: "Reduce (Kamaytir), Reuse (Qayta ishlat), Recycle (Qayta ishla). Sayyoramizni qutqaruvchi 3 ta sehrli qoida bilan tanishing!",
    learningGoals: [
      "Keraksiz ortiqcha buyumlarni xarid qilmaslik (Reduce)",
      "Eski karton qutidan o'yinchoq yoki qalamdon yasash (Reuse)",
      "Toza saralangan chiqindini maxsus qutiga topshirish (Recycle)"
    ],
    quiz: [
      {
        question: "3R formulasining birinchi 'R' harfi — REDUCE nimani bildiradi?",
        options: [
          "Ortiqcha chiqindi va keraksiz xaridlarni kamaytirishni",
          "Ko'proq axlat ishlab chiqarishni",
          "Do'kondagi barcha narsani sotib olishni"
        ],
        correct: 0,
        explanation: "To'g'ri! Eng yaxshi chiqindi — bu umuman hosil bo'lmagan chiqindidir."
      },
      {
        question: "Eski poyabzal qutisini tashlab yubormasdan qalamdon yoki o'yinchoq sandig'i qilish qaysi qoidaga kiradi?",
        options: [
          "REUSE — Qayta foydalanish",
          "BURN — Yoqib yuborish",
          "FORGET — Unutib qo'yish"
        ],
        correct: 0,
        explanation: "Barakalla! Buyumlarni ikkinchi bor foydali maqsadga ishlatish REUSE deb ataladi."
      },
      {
        question: "Chiqindilarni saralash (RECYCLE) jarayonining asosiy sharti nima?",
        options: [
          "Qayta ishlanuvchi materiallar toza va quruq bo'lishi",
          "Ichiga ovqat qoldiqlari to'ldirilishi",
          "Ularni daryoga oqizish"
        ],
        correct: 0,
        explanation: "To'ppa-to'g'ri! Agar qog'oz yoki plastik toza bo'lsa, zavod uni sifatli qayta ishlay oladi."
      }
    ]
  },
  {
    id: 8,
    title: "Kompost Mo'jizasi: Oshxona Chiqindisidan Unumdor Tuproq",
    category: "organic",
    gradeText: "2-5 sinflar uchun",
    grades: [2, 3, 4, 5],
    duration: "4 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Agro-Ekologiya",
    color: "#84cc16",
    youtubeId: "26IO95Xt5WU",
    embedUrl: "https://www.youtube-nocookie.com/embed/26IO95Xt5WU?rel=0",
    summary: "Banan po'stlog'i, olma qoldiqlari va xazonlar qanday qilib o'simliklar uchun eng shirin tabiiy o'g'itga aylanadi?",
    learningGoals: [
      "Qaysi chiqindilar kompostga mos keladi (meva, sabzavot po'choqlari)",
      "Go'sht va yog'li ovqatlarni kompostga solmaslik sababi",
      "Bio-chirindi hosil bo'lishida mikroorganizmlar mehnati"
    ],
    quiz: [
      {
        question: "Quyidagilardan qaysi birini kompost chuquriga tashlash juda foydali?",
        options: [
          "Banan po'chog'i, olma qoldig'i va quruq xazonlar",
          "Plastik butilka qopqoqlari",
          "Temir mixlar va simlar"
        ],
        correct: 0,
        explanation: "To'g'ri! Meva va sabzavot qoldiqlari tuproqda chirib ajoyib bio-o'g'it (gumus) hosil qiladi."
      },
      {
        question: "Kompost qutisiga nima sababdan go'sht va yog'li ovqatlarni tashlamaslik tavsiya etiladi?",
        options: [
          "Chunki ular yomon hid chiqaradi va kemiruvchilarni jalb qilishi mumkin",
          "Chunki ular juda shirin",
          "Chunki ular darhol olmosga aylanadi"
        ],
        correct: 0,
        explanation: "Ofarin! Go'sht va sut mahsulotlari chirish jarayonini buzadi, faqat o'simlik qoldiqlari ma'qul."
      },
      {
        question: "Tayyor bo'lgan tabiiy kompost o'g'iti nima uchun ishlatiladi?",
        options: [
          "Daraxtlar, gullar va sabzavotlar tez va sog'lom o'sishi uchun yerga solinadi",
          "Devorlarni bo'yash uchun",
          "Uydagi idishlarni yuvish uchun"
        ],
        correct: 0,
        explanation: "Barakalla! Kompost — bu kimyoviy dori vositalarisiz olingan eng toza tabiiy ozuqadir."
      }
    ]
  },
  {
    id: 9,
    title: "Suv — Hayot Manbai: Daryolar va Toza Suvni Asrash",
    category: "water",
    gradeText: "1-5 sinflar uchun",
    grades: [1, 2, 3, 4, 5],
    duration: "4 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Suv Saqlovchi",
    color: "#0ea5e9",
    youtubeId: "MEb7nnMLcaA",
    embedUrl: "https://www.youtube-nocookie.com/embed/MEb7nnMLcaA?rel=0",
    summary: "Nega tish yuvganda jo'mrakni yopib qo'yish kerak? Sayyoramizdagi ichimlik suvi zaxiralari va tozalik sirlari.",
    learningGoals: [
      "Dunyodagi ichimlik suvi miqdori cheklanganligi (atigi 1-2%)",
      "Ariq va kanallarga chiqindi tashlamaslik madaniyati",
      "Uyda suvni tejashning oson 3 ta usuli"
    ],
    quiz: [
      {
        question: "Tish tozalayotganda jo'mrakni yopib qo'ysak, 1 martada qancha toza suv tejaladi?",
        options: [
          "Taxminan 5 dan 10 litrgacha toza ichimlik suvi",
          "Atigi 1 tomchi",
          "Umuman tejalmaydi"
        ],
        correct: 0,
        explanation: "To'g'ri! Har kuni jo'mrakni yopish orqali oyiga yuzlab litr toza ichimlik suvi tejaladi."
      },
      {
        question: "Yer sharining aksar qismi suv bilan qoplangan bo'lsa ham, nega suvni tejashimiz kerak?",
        options: [
          "Chunki 97% suv sho'r dengiz suvi bo'lib, chuchuk ichimlik suvi juda kam",
          "Chunki suv erib ketadi",
          "Chunki suv faqat qishda kerak"
        ],
        correct: 0,
        explanation: "Barakalla! Ichishga yaroqli toza chuchuk suv sayyoramizdagi suvning atigi 1-2% ini tashkil etadi."
      },
      {
        question: "Ko'chada, ariq yoki soy bo'yida dam olgach, chiqindilarni nima qilish lozim?",
        options: [
          "Paketga yig'ishtirib olib chiqib, maxsus axlat qutisiga tashlash",
          "Suvga oqizib yuborish",
          "Daraxt tagiga ko'mib qochish"
        ],
        correct: 0,
        explanation: "Ajoyib odob! Suv manbalarini toza saqlash barcha tirik mavjudotlarning hayotini saqlaydi."
      }
    ]
  },
  {
    id: 10,
    title: "Shisha Idishlar: Cheksiz Qayta Ishlanuvchi Mo'jiza",
    category: "glass-metal",
    gradeText: "2-5 sinflar uchun",
    grades: [2, 3, 4, 5],
    duration: "3 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Shisha Sirlari",
    color: "#14b8a6",
    youtubeId: "paRNPCqYj-k",
    embedUrl: "https://www.youtube-nocookie.com/embed/paRNPCqYj-k?rel=0",
    summary: "Shisha tabiiy qum va kvarsdan yasaladi. Uni 1000 marta qayta eritib yangi banka qilsa ham sifatini aslo yo'qotmaydi!",
    learningGoals: [
      "Shishaning cheksiz qayta ishlanish afzalligi",
      "Shisha idishlarni rangiga ko'ra saralash (oq, yashil, jigarrang)",
      "Singan shishani xavfsiz qilib gazetaga o'rash qoidasi"
    ],
    quiz: [
      {
        question: "Shishaning boshqa materiallardan eng katta ustunligi nima?",
        options: [
          "Uni cheksiz marta qayta eritish mumkin va sifati aslo pasaymaydi",
          "U hech qachon sinmaydi",
          "U suvda o'z-o'zidan erib ketadi"
        ],
        correct: 0,
        explanation: "To'g'ri! Shisha 100% cheksiz qayta ishlanadi va yangi tabiiy qumni tejaydi."
      },
      {
        question: "Shisha idishlarni qayta ishlashga topshirishdan oldin nima qilish kerak?",
        options: [
          "Ichidagi suyuqlikni to'kib, chayib, qopqog'ini alohida ajratish",
          "Unga bo'yoq sepish",
          "Bolg'a bilan maydalab sochish"
        ],
        correct: 0,
        explanation: "Barakalla! Toza shisha idishlar zavodda ranglariga ko'ra oson saralanadi."
      },
      {
        question: "Agar ko'chada singan shisha parchalarini ko'rib qolsangiz nima qilish to'g'ri?",
        options: [
          "Kattalarga aytib, qo'lqop bilan ehtiyotkorlik bilan yig'ib qalin qog'ozga o'rab tashlash",
          "Yalangoyoq ustidan yugurib o'tish",
          "Uni o'rtoqlarga qarab otish"
        ],
        correct: 0,
        explanation: "Ofarin! Singan shishani xavfsiz o'rab tashlash boshqalarning jarohatlanishidan asraydi."
      }
    ]
  },
  {
    id: 11,
    title: "Metall va Alyuminiy: Ichimlik Qutilarining Ikkinchi Hayoti",
    category: "glass-metal",
    gradeText: "3-5 sinflar uchun",
    grades: [3, 4, 5],
    duration: "3 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Metall Qayta Ishlash",
    color: "#64748b",
    youtubeId: "HQTUWK7CM-Y",
    embedUrl: "https://www.youtube-nocookie.com/embed/HQTUWK7CM-Y?rel=0",
    summary: "1 dona alyuminiy ichimlik qutisini qayta ishlash televizorni 3 soat ishlatishga yetadigan elektr energiyasini tejaydi!",
    learningGoals: [
      "Alyuminiy va po'lat bankalarning farqi",
      "Qutilarni ezib yassilash orqali transport yukini yengillatish",
      "Qayta ishlangan metaldan velosiped va samolyot qismlari yasalishi"
    ],
    quiz: [
      {
        question: "1 dona alyuminiy ichimlik qutisini qayta ishlash qancha energiyani tejaydi?",
        options: [
          "Televizorni 3 soat davomida ishlatishga yetadigan energiyani",
          "Atigi 1 soniyalik chiroq energiyasini",
          "Hech qanday energiya tejay olmaydi"
        ],
        correct: 0,
        explanation: "To'g'ri! Alyuminiyni noldan eritishga qaraganda qayta ishlash 95% kamroq energiya sarflaydi."
      },
      {
        question: "Ichimlik qutisi (banka)ni qayta ishlash qutisiga tashlashdan oldin nima qilish foydali?",
        options: [
          "Oyoq yoki qo'l bilan ezib, yassilab qo'yish",
          "Ichiga muz to'ldirish",
          "Qutini yirtib sochish"
        ],
        correct: 0,
        explanation: "Barakalla! Yassilangan quti 4 baravar kam joy egallaydi va qutiga ko'proq chiqindi sig'adi."
      },
      {
        question: "Qayta ishlangan alyuminiydan qancha vaqtdan so'ng yana yangi ichimlik qutisi paydo bo'lishi mumkin?",
        options: [
          "Taxminan 60 kun (2 oy) ichida rastalarga qaytadi",
          "100 yildan keyin",
          "Hech qachon yangi quti bo'lmaydi"
        ],
        correct: 0,
        explanation: "Ajoyib fakt! Alyuminiy qayta ishlanib bor-yo'g'i 60 kunda yana yangi mahsulotga aylanadi."
      }
    ]
  },
  {
    id: 12,
    title: "Yashil Energiya va Toza Sayyora: Quyosh va Shamol Kuchi",
    category: "energy",
    gradeText: "3-5 sinflar uchun",
    grades: [3, 4, 5],
    duration: "4 daqiqa",
    watchPoints: 50,
    quizPoints: 75,
    badge: "Eko-Texnologiya",
    color: "#eab308",
    youtubeId: "6djnJxdSQWQ",
    embedUrl: "https://www.youtube-nocookie.com/embed/6djnJxdSQWQ?rel=0",
    summary: "Tutunli ko'mir va gaz o'rniga bepul va toza Quyosh nuri hamda shamol kuchi. Shaharlarimiz qanday toza bo'ladi?",
    learningGoals: [
      "Qayta tiklanuvchi energiya nima va nima uchun u havoni ifloslantirmaydi",
      "Quyosh panellarining ishlash printsipi",
      "Xonadan chiqqanda chiroqni o'chirish orqali tabiatga ko'mak"
    ],
    quiz: [
      {
        question: "Quyidagilardan qaysi biri toza va qayta tiklanuvchi (yashil) energiya manbai hisoblanadi?",
        options: [
          "Quyosh nuri, shamol kuchi va daryo oqimi",
          "Ko'mir va neftni yoqish",
          "Plastik chiqindilarni tutatish"
        ],
        correct: 0,
        explanation: "To'g'ri! Quyosh va shamol energiyasi hech qachon tugamaydi va havoga tutun chiqarmaydi."
      },
      {
        question: "O'quvchi uyda yoki maktabda energiyani tejash uchun nima qilishi kerak?",
        options: [
          "Xonadan chiqayotganda chiroq va televizorni o'chirib qo'yish",
          "Barcha chiroqlarni kechasi bilan yoqib uxlash",
          "Muzlatgich eshigini doim ochiq qoldirish"
        ],
        correct: 0,
        explanation: "Ofarin! Elektr energiyasini tejash orqali elektr stansiyalarining tutun chiqarishini kamaytiramiz."
      },
      {
        question: "Quyosh panellari qaysi narsadan elektr quvvati ishlab chiqaradi?",
        options: [
          "Tabiiy yorug'lik va quyosh nurlaridan",
          "Muz va qordan",
          "Oddiy axlatlardan"
        ],
        correct: 0,
        explanation: "Barakalla! Quyosh batareyalari fotonlarni toza elektr energiyasiga aylantirib beradi."
      }
    ]
  }
];

// ================= 1-5 SINFLAR UCHUN INITIAL LEVELS TOP REYTINGI =================
const INITIAL_LEVELS_TOP = [
  {
    rank: 1,
    studentName: "Jasur Rahimov",
    gradeNum: 5,
    className: "5-A",
    school: "Samarqand sh., 1-IDUM",
    score: 3450,
    levelId: "legend",
    accuracy: "98%",
    actionsCount: 42,
    badgeText: "👑 Legend"
  },
  {
    rank: 2,
    studentName: "Madina Aliyeva",
    gradeNum: 4,
    className: "4-B",
    school: "Toshkent sh., 17-maktab",
    score: 3120,
    levelId: "legend",
    accuracy: "97%",
    actionsCount: 38,
    badgeText: "👑 Legend"
  },
  {
    rank: 3,
    studentName: "Zilola Karimova",
    gradeNum: 3,
    className: "3-A",
    school: "Farg'ona sh., 21-maktab",
    score: 2640,
    levelId: "master",
    accuracy: "95%",
    actionsCount: 31,
    badgeText: "💎 Eco Master"
  },
  {
    rank: 4,
    studentName: "Bekzod Umarov",
    gradeNum: 5,
    className: "5-B",
    school: "Buxoro sh., 5-maktab",
    score: 2210,
    levelId: "master",
    accuracy: "93%",
    actionsCount: 26,
    badgeText: "💎 Eco Master"
  },
  {
    rank: 5,
    studentName: "Shahnoza To'rayeva",
    gradeNum: 4,
    className: "4-A",
    school: "Namangan sh., 3-IDUM",
    score: 1980,
    levelId: "master",
    accuracy: "92%",
    actionsCount: 24,
    badgeText: "💎 Eco Master"
  },
  {
    rank: 6,
    studentName: "Azizbek Qodirov",
    gradeNum: 2,
    className: "2-A",
    school: "Toshkent v., 12-maktab",
    score: 1650,
    levelId: "ranger",
    accuracy: "94%",
    actionsCount: 20,
    badgeText: "⚡ Eco Ranger"
  },
  {
    rank: 7,
    studentName: "Kamola Saidova",
    gradeNum: 3,
    className: "3-B",
    school: "Andijon sh., 2-maktab",
    score: 1420,
    levelId: "ranger",
    accuracy: "90%",
    actionsCount: 18,
    badgeText: "⚡ Eco Ranger"
  },
  {
    rank: 8,
    studentName: "Bobur Mirzayev",
    gradeNum: 1,
    className: "1-A",
    school: "Qarshi sh., 7-maktab",
    score: 1150,
    levelId: "ranger",
    accuracy: "92%",
    actionsCount: 15,
    badgeText: "⚡ Eco Ranger"
  },
  {
    rank: 9,
    studentName: "Malika Yusupova",
    gradeNum: 2,
    className: "2-B",
    school: "Urganch sh., 9-maktab",
    score: 890,
    levelId: "guard",
    accuracy: "88%",
    actionsCount: 12,
    badgeText: "🌳 Eco Guard"
  },
  {
    rank: 10,
    studentName: "Shavkat Oripov",
    gradeNum: 1,
    className: "1-B",
    school: "Navoiy sh., 4-maktab",
    score: 740,
    levelId: "guard",
    accuracy: "86%",
    actionsCount: 10,
    badgeText: "🌳 Eco Guard"
  },
  {
    rank: 11,
    studentName: "Rayhona Shokirova",
    gradeNum: 1,
    className: "1-A",
    school: "Jizzax sh., 14-maktab",
    score: 480,
    levelId: "explorer",
    accuracy: "89%",
    actionsCount: 7,
    badgeText: "🌿 Explorer"
  },
  {
    rank: 12,
    studentName: "Diyorbek Hakimov",
    gradeNum: 2,
    className: "2-A",
    school: "Termiz sh., 11-maktab",
    score: 390,
    levelId: "explorer",
    accuracy: "85%",
    actionsCount: 6,
    badgeText: "🌿 Explorer"
  }
];

// ================= SINFLAR CHEMPIONATI (1-5 SINFLAR) =================
const INITIAL_CLASSES_TOP = [
  {
    rank: 1,
    gradeNum: 4,
    className: "4-A sinf",
    school: "Toshkent sh., 17-maktab",
    totalScore: 5820,
    membersCount: 26,
    topStudent: "Madina Aliyeva",
    levelBadge: "👑 Legend Sinf"
  },
  {
    rank: 2,
    gradeNum: 5,
    className: "5-A sinf",
    school: "Samarqand sh., 1-IDUM",
    totalScore: 5460,
    membersCount: 24,
    topStudent: "Jasur Rahimov",
    levelBadge: "👑 Legend Sinf"
  },
  {
    rank: 3,
    gradeNum: 3,
    className: "3-A sinf",
    school: "Farg'ona sh., 21-maktab",
    totalScore: 4980,
    membersCount: 22,
    topStudent: "Zilola Karimova",
    levelBadge: "💎 Master Sinf"
  },
  {
    rank: 4,
    gradeNum: 2,
    className: "2-A sinf",
    school: "Toshkent v., 12-maktab",
    totalScore: 4320,
    membersCount: 20,
    topStudent: "Azizbek Qodirov",
    levelBadge: "⚡ Ranger Sinf"
  },
  {
    rank: 5,
    gradeNum: 1,
    className: "1-A sinf",
    school: "Qarshi sh., 7-maktab",
    totalScore: 3890,
    membersCount: 25,
    topStudent: "Bobur Mirzayev",
    levelBadge: "⚡ Ranger Sinf"
  }
];

// ================= TASDIQLANGAN EKO-HARAKATLAR (FOTOSURATLAR FEED) =================
const INITIAL_COMMUNITY_PHOTOS = [
  {
    id: 'photo-1',
    studentName: "Azizbek Qodirov",
    gradeNum: 2,
    className: "2-A",
    school: "Toshkent v., 12-maktab",
    wasteType: "Plastik PET idish",
    binType: "recycle",
    binLabel: "♻️ Yashil Qayta Ishlash Qutisi",
    imgUrl: "assets/kid_plastic.jpg",
    note: "Sinfimizda tanaffusda sharbat ichib, idishni yaxshilab chayib va siqib yashil qutiga soldim!",
    awardedPoints: 75,
    likes: 38,
    date: "Bugun, 08:20",
    verified: true
  },
  {
    id: 'photo-2',
    studentName: "Madina Aliyeva",
    gradeNum: 4,
    className: "4-B",
    school: "Toshkent sh., 17-maktab",
    wasteType: "Qog'oz va Makulatura",
    binType: "recycle",
    binLabel: "♻️ Ko'k Qog'oz Qutisi",
    imgUrl: "assets/kid_paper.jpg",
    note: "Chizmachilik va matematika darsidagi eski qoralama qog'ozlarni alohida qutiga jamladik. Daraxtlarni asraymiz!",
    awardedPoints: 75,
    likes: 45,
    date: "Bugun, 08:05",
    verified: true
  },
  {
    id: 'photo-3',
    studentName: "Jasur Rahimov",
    gradeNum: 5,
    className: "5-A",
    school: "Samarqand sh., 1-IDUM",
    wasteType: "Alyuminiy banka",
    binType: "recycle",
    binLabel: "♻️ Sariq Metall Qutisi",
    imgUrl: "assets/kid_cans.jpg",
    note: "Maktab hovlisidagi maxsus to'q sariq qutiga kola bankasini yassilab tashladim. 60 kunda yangi idish bo'ladi!",
    awardedPoints: 75,
    likes: 29,
    date: "Kecha",
    verified: true
  }
];

// Qiziqarli Eko-Faktlar
const ECO_FACTS = [
  "💡 Bitta qayta ishlangan alyuminiy banka televizorni 3 soat ishlatishga yetadigan elektrni tejaydi!",
  "🌳 60 kg to'plangan makulatura qog'ozi bitta katta daraxtni kesilishdan saqlaydi.",
  "🌊 Har yili okeanlarga 8 million tonnadan ortiq plastik chiqindi tushadi.",
  "✨ Shisha materialini 1 million marta eritib qayta ishlasa ham uning sifati aslo buzilmaydi!",
  "🛍️ Plastik paketdan o'rtacha 12 daqiqa foydalaniladi, ammo u 400 yilgacha parchalanmaydi.",
  "🚴 Qayta ishlangan 670 ta konserva bankasidan bitta sifatli yangi velosiped yasash mumkin!"
];

