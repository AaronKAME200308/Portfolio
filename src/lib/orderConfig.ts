// Données partagées entre la page client (/order/:token) et le tableau de bord (/admin)

export type Currency = "XAF" | "USD";
export type Lang = "fr" | "en";

export const PROJECT_TYPES = [
  { value: "site_vitrine", label: "Site vitrine", desc: "Présenter votre activité en ligne" },
  { value: "site_ecommerce", label: "E-commerce", desc: "Vendre vos produits en ligne" },
  { value: "application_web", label: "Application web", desc: "Un outil métier sur mesure" },
  { value: "application_mobile", label: "Application mobile", desc: "Android et iOS" },
  { value: "dashboard_admin", label: "Dashboard / Admin", desc: "Piloter vos données" },
  { value: "autre", label: "Autre", desc: "Décrivez votre besoin" },
] as const;

// Mêmes clés en base, libellés selon la devise choisie par le client
export const BUDGETS: Record<Currency, { value: string; label: string }[]> = {
  XAF: [
    { value: "palier_1", label: "Moins de 300 000 FCFA" },
    { value: "palier_2", label: "300 000 – 600 000 FCFA" },
    { value: "palier_3", label: "600 000 – 1 800 000 FCFA" },
    { value: "palier_4", label: "1 800 000 – 3 000 000 FCFA" },
    { value: "palier_5", label: "Plus de 3 000 000 FCFA" },
    { value: "a_discuter", label: "À discuter" },
  ],
  USD: [
    { value: "palier_1", label: "Moins de 500 $" },
    { value: "palier_2", label: "500 – 1 000 $" },
    { value: "palier_3", label: "1 000 – 3 000 $" },
    { value: "palier_4", label: "3 000 – 5 000 $" },
    { value: "palier_5", label: "Plus de 5 000 $" },
    { value: "a_discuter", label: "À discuter" },
  ],
};

export const DEADLINES = [
  { value: "urgent_2sem", label: "Urgent · moins de 2 semaines" },
  { value: "1mois", label: "Environ 1 mois" },
  { value: "2_3mois", label: "2 à 3 mois" },
  { value: "plus_3mois", label: "Plus de 3 mois" },
  { value: "flexible", label: "Flexible" },
] as const;

export const STATUSES = [
  { value: "nouveau", label: "Nouveau", dot: "#6baf7b" },
  { value: "en_etude", label: "En étude", dot: "#3b82f6" },
  { value: "devis_envoye", label: "Devis envoyé", dot: "#f59e0b" },
  { value: "en_cours", label: "En cours", dot: "#1e7b4a" },
  { value: "livre", label: "Livré", dot: "#0e2f20" },
  { value: "annule", label: "Annulé", dot: "#dc2626" },
] as const;

export const labelOf = (list: readonly { value: string; label: string }[], v?: string | null) =>
  list.find((i) => i.value === v)?.label ?? v ?? "—";

export const budgetLabel = (range?: string | null, cur?: string | null) =>
  labelOf(BUDGETS[cur === "USD" ? "USD" : "XAF"], range);

/* ── Libellés anglais (page client) ── */
const EN: Record<string, string> = {
  site_vitrine: "Showcase website", site_ecommerce: "E-commerce", application_web: "Web application",
  application_mobile: "Mobile application", dashboard_admin: "Dashboard / Admin", autre: "Other",
  urgent_2sem: "Urgent · under 2 weeks", "1mois": "About 1 month", "2_3mois": "2 to 3 months",
  plus_3mois: "More than 3 months", flexible: "Flexible",
  nouveau: "New", en_etude: "Under review", devis_envoye: "Quote sent", en_cours: "In progress",
  livre: "Delivered", annule: "Cancelled",
};

export const TYPE_DESC_EN: Record<string, string> = {
  site_vitrine: "Present your business online", site_ecommerce: "Sell your products online",
  application_web: "A custom business tool", application_mobile: "Android and iOS",
  dashboard_admin: "Manage your data", autre: "Describe your need",
};

/* Libellé dans la langue demandée (français par défaut, comme l'admin) */
export const tr = (
  list: readonly { value: string; label: string }[],
  v: string | null | undefined,
  lang: Lang = "fr",
) => (lang === "en" && v && EN[v] ? EN[v] : labelOf(list, v));

const BUDGET_EN: Record<Currency, Record<string, string>> = {
  XAF: {
    palier_1: "Under 300,000 FCFA", palier_2: "300,000 – 600,000 FCFA", palier_3: "600,000 – 1,800,000 FCFA",
    palier_4: "1,800,000 – 3,000,000 FCFA", palier_5: "Over 3,000,000 FCFA", a_discuter: "To be discussed",
  },
  USD: {
    palier_1: "Under $500", palier_2: "$500 – $1,000", palier_3: "$1,000 – $3,000",
    palier_4: "$3,000 – $5,000", palier_5: "Over $5,000", a_discuter: "To be discussed",
  },
};

export const BUDGETS_L = (cur: Currency, lang: Lang) =>
  lang === "en" ? BUDGETS[cur].map((b) => ({ ...b, label: BUDGET_EN[cur][b.value] })) : BUDGETS[cur];

export const budgetLabelL = (range: string | null | undefined, cur: string | null | undefined, lang: Lang) =>
  lang === "en" ? BUDGET_EN[cur === "USD" ? "USD" : "XAF"][range ?? ""] ?? range ?? "—" : budgetLabel(range, cur);