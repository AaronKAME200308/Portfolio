// Données partagées entre la page client (/order/:token) et le tableau de bord (/admin)

export type Currency = "XAF" | "USD";

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