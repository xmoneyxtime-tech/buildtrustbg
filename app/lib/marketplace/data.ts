import { CompanyProfile } from "./types";

const initialCompanies: CompanyProfile[] = [
  {
    id: "cmp-001",
    companyName: "Светлина Строй",
    email: "contact@svetlinastroy.bg",
    phone: "+359 888 123 456",
    city: "София",
    service: "Строителство на къщи",
    description: "Професионална компания за строителство и ремонтни дейности.",
    website: "https://svetlinastroy.bg",
    status: "pending",
    submittedAt: "2026-07-08",
  },
  {
    id: "cmp-002",
    companyName: "Доверие Инженеринг",
    email: "office@doverie-engineering.bg",
    phone: "+359 878 654 321",
    city: "Пловдив",
    service: "Изолации",
    description: "Експерти в енергийна ефективност и изолационни решения.",
    status: "approved",
    submittedAt: "2026-07-07",
  },
];

export const marketplaceCompanies: CompanyProfile[] = initialCompanies;
