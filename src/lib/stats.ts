// Calculs du tableau de bord (aucune dépendance, tout se fait côté navigateur)

export type Period = "7d" | "30d" | "12m" | "all";
export const PERIODS: { id: Period; label: string }[] = [
  { id: "7d", label: "7 jours" },
  { id: "30d", label: "30 jours" },
  { id: "12m", label: "12 mois" },
  { id: "all", label: "Tout" },
];

export type StatOrder = {
  id: string; source?: string | null; status: string; form_completed: boolean;
  budget_range: string | null; project_title: string | null; submitted_at: string;
  client_reviews?: ({ rating: number; approved: boolean } | null)[] | { rating: number; approved: boolean } | null;
};
export type StatVisit = { created_at: string; visitor_id: string; lang: string | null; device: string | null };
export type InvoiceLine = { label: string; price: number; qty: number };
export type StatInvoice = { order_id: string; issued_on: string; lines: InvoiceLine[]; discount: number };

/** Une ligne « contact » = envoyée depuis le formulaire du site */
export const isContact = (o: StatOrder) => o.source === "contact" || (o.project_title ?? "").startsWith("Contact :");
/** Une commande « validée » = tu as accepté le projet (en cours ou livré) */
export const isValidated = (o: StatOrder) => o.status === "en_cours" || o.status === "livre";

/** Valeur centrale de chaque palier de budget, en FCFA (estimation) */
export const PALIER_MID: Record<string, number> = {
  palier_1: 200_000, palier_2: 450_000, palier_3: 1_200_000, palier_4: 2_400_000, palier_5: 3_500_000,
};
export const PALIER_LABEL: Record<string, string> = {
  palier_1: "< 300 k", palier_2: "300–600 k", palier_3: "600 k–1,8 M", palier_4: "1,8–3 M", palier_5: "> 3 M", a_discuter: "À discuter",
};

export const invoiceTotal = (inv: { lines: InvoiceLine[]; discount: number }) =>
  Math.max(0, inv.lines.reduce((s, l) => s + (Number(l.price) || 0) * (Number(l.qty) || 0), 0) - (Number(inv.discount) || 0));

export const fcfa = (n: number) =>
  `${new Intl.NumberFormat("fr-FR").format(Math.round(n)).replace(/[  ]/g, " ")} FCFA`;

const DAY = 86_400_000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Fenêtre courante et fenêtre précédente de même durée */
export function windows(period: Period, now = new Date()) {
  const end = new Date(now.getTime() + 1);
  if (period === "all") return { start: null as Date | null, end, prevStart: null as Date | null };
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 365;
  const start = new Date(startOfDay(now).getTime() - (days - 1) * DAY);
  const prevStart = new Date(start.getTime() - days * DAY);
  return { start, end, prevStart };
}

const inRange = (iso: string, a: Date | null, b: Date) => {
  const t = new Date(iso).getTime();
  return (a === null || t >= a.getTime()) && t < b.getTime();
};

export type Delta = { value: number | null; label: string; up: boolean | null };
export function delta(cur: number, prev: number | null): Delta {
  if (prev === null) return { value: null, label: "", up: null };
  if (prev === 0) return cur === 0 ? { value: 0, label: "=", up: null } : { value: null, label: "nouveau", up: true };
  const v = Math.round(((cur - prev) / prev) * 100);
  return { value: v, label: `${v > 0 ? "+" : ""}${v} %`, up: v === 0 ? null : v > 0 };
}

export type Bucket = { label: string; contacts: number; orders: number; visits: number };

export function computeStats(
  period: Period, orders: StatOrder[], visits: StatVisit[], invoices: StatInvoice[], now = new Date(),
) {
  const { start, end, prevStart } = windows(period, now);
  const hasPrev = prevStart !== null && start !== null;
  const cur = <T,>(items: T[], date: (x: T) => string) => items.filter((x) => inRange(date(x), start, end));
  const prev = <T,>(items: T[], date: (x: T) => string) =>
    hasPrev ? items.filter((x) => inRange(date(x), prevStart, start)) : [];

  const received = orders.filter((o) => o.form_completed);
  const contactsAll = received.filter(isContact);
  const ordersAll = received.filter((o) => !isContact(o));

  const uniq = (v: StatVisit[]) => new Set(v.map((x) => x.visitor_id)).size;
  const sum = (inv: StatInvoice[]) => inv.reduce((s, i) => s + invoiceTotal(i), 0);

  const vC = cur(visits, (v) => v.created_at), vP = prev(visits, (v) => v.created_at);
  const cC = cur(contactsAll, (o) => o.submitted_at), cP = prev(contactsAll, (o) => o.submitted_at);
  const oC = cur(ordersAll, (o) => o.submitted_at), oP = prev(ordersAll, (o) => o.submitted_at);
  const valC = cur(received.filter(isValidated), (o) => o.submitted_at);
  const valP = prev(received.filter(isValidated), (o) => o.submitted_at);
  const delC = valC.filter((o) => o.status === "livre");
  const iC = cur(invoices, (i) => i.issued_on), iP = prev(invoices, (i) => i.issued_on);

  const kpi = {
    visitors: { v: uniq(vC), d: delta(uniq(vC), hasPrev ? uniq(vP) : null) },
    contacts: { v: cC.length, d: delta(cC.length, hasPrev ? cP.length : null) },
    orders: { v: oC.length, d: delta(oC.length, hasPrev ? oP.length : null) },
    validated: { v: valC.length, d: delta(valC.length, hasPrev ? valP.length : null) },
    billed: { v: sum(iC), d: delta(sum(iC), hasPrev ? sum(iP) : null) },
  };

  const funnel = [
    { label: "Visiteurs", value: uniq(vC) },
    { label: "Demandes reçues", value: cC.length + oC.length },
    { label: "Commandes validées", value: valC.length },
    { label: "Projets livrés", value: delC.length },
  ];

  // Revenu estimé par palier (commandes validées) + facturé réel
  const palierKeys = ["palier_1", "palier_2", "palier_3", "palier_4", "palier_5", "a_discuter"];
  const byPalier = palierKeys.map((k) => {
    const list = valC.filter((o) => (o.budget_range ?? "a_discuter") === k);
    return { key: k, label: PALIER_LABEL[k], count: list.length, estimate: list.length * (PALIER_MID[k] ?? 0) };
  });
  const invoicedIds = new Set(iC.map((i) => i.order_id));
  const pipeline = valC.filter((o) => !invoicedIds.has(o.id))
    .reduce((s, o) => s + (PALIER_MID[o.budget_range ?? ""] ?? 0), 0);

  // Avis
  const rv = orders.flatMap((o) => (Array.isArray(o.client_reviews) ? o.client_reviews : [o.client_reviews]))
    .filter((r): r is { rating: number; approved: boolean } => !!r);
  const stars = [5, 4, 3, 2, 1].map((n) => ({ n, count: rv.filter((r) => r.rating === n).length }));
  const reviews = {
    count: rv.length,
    avg: rv.length ? rv.reduce((s, r) => s + r.rating, 0) / rv.length : 0,
    pending: rv.filter((r) => !r.approved).length,
    stars,
  };

  // Barres : contacts vs commandes dans le temps
  const buckets: Bucket[] = [];
  const mk = (a: Date, b: Date, label: string) => {
    const f = (items: StatOrder[]) => items.filter((o) => inRange(o.submitted_at, a, b)).length;
    buckets.push({
      label, contacts: f(contactsAll), orders: f(ordersAll),
      visits: new Set(visits.filter((v) => inRange(v.created_at, a, b)).map((v) => v.visitor_id)).size,
    });
  };
  const fmtD = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  const fmtM = (d: Date) => d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
  const today = startOfDay(now);
  if (period === "7d" || period === "30d") {
    const step = period === "7d" ? 1 : 3, n = period === "7d" ? 7 : 10;
    for (let i = n - 1; i >= 0; i--) {
      const a = new Date(today.getTime() - i * step * DAY), b = new Date(a.getTime() + step * DAY);
      mk(a, b, fmtD(a));
    }
  } else {
    let months = 12;
    if (period === "all") {
      const first = [...orders.map((o) => o.submitted_at), ...visits.map((v) => v.created_at)].sort()[0];
      if (first) {
        const f = new Date(first);
        months = Math.min(24, Math.max(3, (now.getFullYear() - f.getFullYear()) * 12 + now.getMonth() - f.getMonth() + 1));
      } else months = 6;
    }
    for (let i = months - 1; i >= 0; i--) {
      const a = new Date(now.getFullYear(), now.getMonth() - i, 1), b = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      mk(a, b, fmtM(a));
    }
  }

  return { kpi, funnel, byPalier, pipeline, reviews, buckets };
}