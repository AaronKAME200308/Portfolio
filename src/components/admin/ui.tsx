import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { keyWhite, inputCls, type SortDef } from "../../lib/adminData";

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest">{title}</h1>
        {sub && <p className="text-sm text-ink-mute mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-aun hover:underline">
      <ArrowLeft size={15} /> {label}
    </Link>
  );
}

export function Panel({ title, aside, children }: { title?: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl sm:rounded-3xl bg-white/70 border-2 border-ink/10 p-4 sm:p-6">
      {(title || aside) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {title && <h2 className="font-mono-label text-aun">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="font-mono-label !text-[10px] text-ink-soft">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-ink-mute py-10 text-sm">{children}</p>;
}

/** Recherche + tri + export, empilés sur mobile */
export function Toolbar<T>({
  q, onQ, sort, onSort, sorts, onExport, placeholder = "Rechercher…",
}: {
  q: string; onQ: (v: string) => void; sort: string; onSort: (v: string) => void;
  sorts: SortDef<T>[]; onExport?: () => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1 min-w-0">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none" />
        <input className={`${inputCls} !pl-10`} type="search" placeholder={placeholder} value={q}
          onChange={(e) => onQ(e.target.value)} aria-label="Rechercher" />
      </div>
      <div className="flex gap-2">
        <select className={`${inputCls} flex-1 sm:w-44 sm:flex-none`} value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Trier par">
          {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {onExport && (
          <button type="button" onClick={onExport} aria-label="Exporter en CSV" title="Exporter en CSV"
            className={`keycap px-4 text-xs font-semibold shrink-0 ${keyWhite}`}>
            <Download size={15} /> <span className="hidden sm:inline">CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}

/** Pastilles de filtre : une seule ligne défilante sur mobile */
export function Chips<V extends string>({
  value, onChange, options,
}: { value: V; onChange: (v: V) => void; options: { value: V; label: string; count?: number }[] }) {
  return (
    <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto sm:flex-wrap pb-1 [scrollbar-width:none]">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} aria-pressed={value === o.value}
          className={`font-mono-label !text-[11px] whitespace-nowrap shrink-0 rounded-full px-3 py-1.5 border-2 transition ${
            value === o.value ? "bg-forest text-cream border-forest" : "border-ink/15 text-ink-soft hover:border-aun"}`}>
          {o.label}{o.count !== undefined && <span className="opacity-60"> · {o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Pager({ page, pages, total, onPage }: { page: number; pages: number; total: number; onPage: (p: number) => void }) {
  if (total === 0) return null;
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <p className="text-xs text-ink-mute">{total} résultat{total > 1 ? "s" : ""}</p>
      {pages > 1 && (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onPage(page - 1)} disabled={page === 0} aria-label="Page précédente"
            className="p-2 rounded-lg border-2 border-ink/15 disabled:opacity-30 hover:border-aun"><ChevronLeft size={16} /></button>
          <span className="font-mono-label !text-[11px] text-ink-soft">{page + 1} / {pages}</span>
          <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages - 1} aria-label="Page suivante"
            className="p-2 rounded-lg border-2 border-ink/15 disabled:opacity-30 hover:border-aun"><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
}