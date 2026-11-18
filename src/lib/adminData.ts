import { useState } from "react";

export type Review = { id: string; rating: number; comment: string; approved: boolean; submitted_at?: string };
export type Order = {
  id: string; token: string; reference: string; status: string; form_completed: boolean;
  client_name: string | null; client_email: string | null; client_phone: string | null;
  client_company: string | null; project_type: string | null; project_title: string | null;
  description: string | null; features: string | null; preferred_techs: string | null;
  visual_references: string | null; budget_range: string | null; budget_currency: string;
  deadline: string | null; additional_notes: string | null; admin_notes: string | null;
  submitted_at: string; source?: string | null;
  client_reviews: Review[] | Review | null;
};

export const inputCls =
  "w-full rounded-xl border-2 border-ink/10 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-aun focus:ring-4 focus:ring-aun/15";
export const keyGreen = "[--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]";
export const keyWhite = "[--key-face:#ffffff] [--key-edge:#b9c8bd] [--key-text:#0e2f20]";

export const reviewOf = (o: Order): Review | null =>
  Array.isArray(o.client_reviews) ? o.client_reviews[0] ?? null : o.client_reviews;
export const linkOf = (token: string) => `${window.location.origin}/order/${token}`;
export const dateFr = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString("fr-FR") : "—");
export const dateTimeFr = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Export CSV lisible par Excel (séparateur « ; », accents conservés) */
export function downloadCsv(filename: string, header: string[], rows: (string | number | null | undefined)[][]) {
  const cell = (v: string | number | null | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const body = [header, ...rows].map((r) => r.map(cell).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + body], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type SortDef<T> = { id: string; label: string; cmp: (a: T, b: T) => number };

/** Recherche + tri + pagination pour une liste */
export function useList<T>(items: T[], haystack: (x: T) => string, sorts: SortDef<T>[], pageSize = 20) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(sorts[0].id);
  const [page, setPage] = useState(0);
  const n = norm(q.trim());
  const cmp = (sorts.find((s) => s.id === sort) ?? sorts[0]).cmp;
  const all = items.filter((x) => !n || norm(haystack(x)).includes(n)).sort(cmp);
  const pages = Math.max(1, Math.ceil(all.length / pageSize));
  const p = Math.min(page, pages - 1);
  return {
    q, setQ: (v: string) => { setQ(v); setPage(0); },
    sort, setSort: (v: string) => { setSort(v); setPage(0); },
    page: p, setPage, pages, all, rows: all.slice(p * pageSize, (p + 1) * pageSize),
  };
}