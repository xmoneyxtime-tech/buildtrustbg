export type Company = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  status: "pending" | "approved" | "rejected";
  verification: "none" | "gold" | "featured" | "premium";
  submittedAt: string;
  website?: string;
};

export type GoldApplication = {
  id: string;
  companyName: string;
  email: string;
  city: string;
  appliedAt: string;
  status: "pending" | "approved" | "rejected";
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export type City = {
  id: string;
  name: string;
  region: string;
};

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "БетонСтрой АД",
    email: "info@betonstroy.bg",
    phone: "+359 2 123 4567",
    city: "София",
    service: "Бетонни работи",
    status: "approved",
    verification: "gold",
    submittedAt: "2026-06-01",
    website: "betonstroy.bg",
  },
  {
    id: "2",
    name: "ПроГрад ЕООД",
    email: "hello@prograd.bg",
    phone: "+359 32 654 321",
    city: "Пловдив",
    service: "Строителни услуги",
    status: "approved",
    verification: "premium",
    submittedAt: "2026-05-15",
    website: "prograd.bg",
  },
  {
    id: "3",
    name: "МеталКонструкции ООД",
    email: "contact@metalkon.bg",
    phone: "+359 44 555 666",
    city: "Варна",
    service: "Метални конструкции",
    status: "pending",
    verification: "none",
    submittedAt: "2026-07-05",
  },
  {
    id: "4",
    name: "ДърветоДом АД",
    email: "info@darvetodom.bg",
    phone: "+359 62 777 888",
    city: "Велико Търново",
    service: "Дървени конструкции",
    status: "approved",
    verification: "none",
    submittedAt: "2026-04-20",
    website: "darvetodom.bg",
  },
  {
    id: "5",
    name: "ФасадМастер ЕООД",
    email: "master@fasad.bg",
    phone: "+359 87 999 000",
    city: "Бургас",
    service: "Фасадни работи",
    status: "rejected",
    verification: "none",
    submittedAt: "2026-03-10",
  },
  {
    id: "6",
    name: "РемонтПро ООД",
    email: "pro@remontpro.bg",
    phone: "+359 89 111 222",
    city: "Габрово",
    service: "Ремонтни работи",
    status: "pending",
    verification: "none",
    submittedAt: "2026-07-07",
  },
  {
    id: "7",
    name: "ПаркСтрой АД",
    email: "info@parkstroy.bg",
    phone: "+359 91 333 444",
    city: "Благоевград",
    service: "Паркови съоръжения",
    status: "approved",
    verification: "featured",
    submittedAt: "2026-02-14",
    website: "parkstroy.bg",
  },
];

export const mockGoldApplications: GoldApplication[] = [
  {
    id: "1",
    companyName: "БетонСтрой АД",
    email: "info@betonstroy.bg",
    city: "София",
    appliedAt: "2026-06-20",
    status: "approved",
  },
  {
    id: "2",
    companyName: "СметосистемиАД",
    email: "contact@smetosy.bg",
    city: "Варна",
    appliedAt: "2026-07-05",
    status: "pending",
  },
  {
    id: "3",
    companyName: "ПроГрад ЕООД",
    email: "hello@prograd.bg",
    city: "Пловдив",
    appliedAt: "2026-06-28",
    status: "pending",
  },
];

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Бетонни работи",
    slug: "beton",
    icon: "🏗️",
    description: "Всички видове бетонни конструкции и работи",
  },
  {
    id: "2",
    name: "Строителни услуги",
    slug: "gradba",
    icon: "🏢",
    description: "Професионални строителни услуги",
  },
  {
    id: "3",
    name: "Метални конструкции",
    slug: "metal",
    icon: "⚙️",
    description: "Производство и монтаж на метални конструкции",
  },
  {
    id: "4",
    name: "Дървени конструкции",
    slug: "darvo",
    icon: "🪵",
    description: "Дървени конструкции и подови покрития",
  },
  {
    id: "5",
    name: "Фасадни работи",
    slug: "fasad",
    icon: "🎨",
    description: "Фасадни работи и изолации",
  },
  {
    id: "6",
    name: "Ремонтни работи",
    slug: "remont",
    icon: "🔨",
    description: "Ремонт и реновация",
  },
  {
    id: "7",
    name: "Ландшафтни работи",
    slug: "landshaft",
    icon: "🌳",
    description: "Ландшафтен дизайн и озеленяване",
  },
  {
    id: "8",
    name: "Паркови съоръжения",
    slug: "park",
    icon: "🎪",
    description: "Паркови съоръжения и открити пространства",
  },
];

export const mockCities: City[] = [
  { id: "1", name: "София", region: "Столична" },
  { id: "2", name: "Пловдив", region: "Пловдивска" },
  { id: "3", name: "Варна", region: "Варненска" },
  { id: "4", name: "Бургас", region: "Бургаска" },
  { id: "5", name: "Габрово", region: "Габровска" },
  { id: "6", name: "Велико Търново", region: "Великотърновска" },
  { id: "7", name: "Благоевград", region: "Благоевградска" },
  { id: "8", name: "Русе", region: "Русенска" },
];
