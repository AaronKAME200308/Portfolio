import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus, Star } from "lucide-react";
import {
  PERIODS, computeStats, fcfa, type Delta, type Period, type StatInvoice, type StatOrder, type StatVisit,
} from "../../lib/stats";

function DeltaChip({ d }: { d: Delta }) {
  if (!d.label) return null;
  const Icon = d.up === null ? Minus : d.up ? ArrowUpRight : ArrowDownRight;
  const cls = d.up === null ? "bg-ink/5 text-ink-mute" : d.up ? "bg-aun/15 text-aun" : "bg-red-100 text-red-700";
  return (
    <span className={`inline-flex items-center gap-0.5 whitespace-nowrap shrink-0 rounded-md px-1.5 py-0.5 font-mono-label !text-[10px] ${cls}`}
      title="Par rapport à la période précédente de même durée">
      <Icon size={11} /> {d.label}
    </span>
  );
}

function Kpi({ label, value, d, hint }: { label: string; value: string; d: Delta; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white border-2 border-ink/10 p-4">
      <p className="font-mono-label !text-[10px] text-ink-mute">{label}</p>
      <p className="font-display font-extrabold text-2xl text-forest mt-1 leading-tight">{value}</p>
      <div className="mt-2 flex items-center gap-2 min-h-[20px]">
        <DeltaChip d={d} />
        {hint && <span className="text-[11px] text-ink-mute">{hint}</span>}
      </div>
    </div>
  );
}

const Card = ({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) => (
  <section className="min-w-0 rounded-2xl sm:rounded-3xl bg-white/70 border-2 border-ink/10 p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-4">
      <h3 className="font-mono-label text-aun">{title}</h3>
      {aside}
    </div>
    {children}
  </section>
);

export default function StatsPanel({
  orders, visits, invoices, visitsReady,
}: { orders: StatOrder[]; visits: StatVisit[]; invoices: StatInvoice[]; visitsReady: boolean }) {
  const [period, setPeriod] = useState<Period>("30d");
  const s = useMemo(() => computeStats(period, orders, visits, invoices), [period, orders, visits, invoices]);

  const maxBar = Math.max(1, ...s.buckets.map((b) => Math.max(b.contacts, b.orders)));
  const funnelMax = Math.max(1, ...s.funnel.map((f) => f.value));
  const palMax = Math.max(1, ...s.byPalier.map((p) => p.count));
  const totContacts = s.buckets.reduce((a, b) => a + b.contacts, 0);
  const totOrders = s.buckets.reduce((a, b) => a + b.orders, 0);

  return (
    <div className="space-y-4">
      {/* période */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-mono-label text-ink-soft mr-1">Période</p>
        {PERIODS.map((p) => (
          <button key={p.id} onClick={() => setPeriod(p.id)} aria-pressed={period === p.id}
            className={`font-mono-label !text-[11px] rounded-full px-3 py-1.5 border-2 transition ${
              period === p.id ? "bg-forest text-cream border-forest" : "border-ink/15 text-ink-soft hover:border-aun"}`}>
            {p.label}
          </button>
        ))}
        {period !== "all" && <span className="ml-auto text-[11px] text-ink-mute">Comparé à la période précédente</span>}
      </div>

      {/* chiffres clés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Visiteurs uniques" value={visitsReady ? String(s.kpi.visitors.v) : "—"} d={s.kpi.visitors.d}
          hint={!visitsReady ? "table à créer" : s.filtered.bots + s.filtered.owner > 0 ? `${s.filtered.bots} robots · ${s.filtered.owner} vous (masqués)` : undefined} />
        <Kpi label="Contacts" value={String(s.kpi.contacts.v)} d={s.kpi.contacts.d} hint="formulaire du site" />
        <Kpi label="Commandes validées" value={String(s.kpi.validated.v)} d={s.kpi.validated.d} hint="en cours + livrées" />
        <Kpi label="Facturé" value={fcfa(s.kpi.billed.v)} d={s.kpi.billed.d} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* comparaison */}
        <Card title="Contacts vs commandes"
          aside={
            <span className="flex items-center gap-3 text-[11px] text-ink-soft">
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-moss" /> Contacts {totContacts}</span>
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-forest" /> Commandes {totOrders}</span>
            </span>
          }>
          <div className="flex items-end gap-1.5 h-40" role="img"
            aria-label={`Contacts : ${totContacts}, commandes : ${totOrders}`}>
            {s.buckets.map((b, i) => (
              <div key={i} className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-1"
                title={`${b.label} · ${b.contacts} contact(s), ${b.orders} commande(s)`}>
                <div className="flex items-end gap-[2px] w-full justify-center flex-1">
                  <div className="w-1/2 max-w-[14px] rounded-t bg-moss" style={{ height: `${(b.contacts / maxBar) * 100}%`, minHeight: b.contacts ? 3 : 0 }} />
                  <div className="w-1/2 max-w-[14px] rounded-t bg-forest" style={{ height: `${(b.orders / maxBar) * 100}%`, minHeight: b.orders ? 3 : 0 }} />
                </div>
                <span className="font-mono-label !text-[9px] text-ink-mute truncate max-w-full">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-ink-mute mt-3">
            Contact = message envoyé depuis le site. Commande = projet suivi via un lien client.
          </p>
        </Card>

        {/* entonnoir */}
        <Card title="Entonnoir de conversion">
          <ul className="space-y-3">
            {s.funnel.map((f, i) => {
              const before = i === 0 ? null : s.funnel[i - 1].value;
              const rate = before ? Math.round((f.value / before) * 100) : null;
              return (
                <li key={f.label}>
                  <div className="flex items-baseline justify-between text-sm mb-1">
                    <span className="font-semibold text-forest">{f.label}</span>
                    <span className="font-mono-label !text-[11px] text-ink-soft">
                      {i === 0 && !visitsReady ? "—" : f.value}
                      {rate !== null && <span className="text-aun"> · {rate} %</span>}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-ink/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-moss to-aun transition-[width] duration-500"
                      style={{ width: `${Math.max(2, (f.value / funnelMax) * 100)}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] text-ink-mute mt-3">Le pourcentage compare chaque étape à la précédente.</p>
        </Card>

        {/* revenus par palier */}
        <Card title="Revenus par palier de budget"
          aside={<span className="font-mono-label !text-[11px] text-ink-soft">Facturé : {fcfa(s.kpi.billed.v)}</span>}>
          <ul className="space-y-2.5">
            {s.byPalier.map((p) => (
              <li key={p.key} className="grid grid-cols-[64px_minmax(0,1fr)_auto] sm:grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3 text-sm">
                <span className="font-mono-label !text-[10px] text-ink-soft">{p.label}</span>
                <div className="h-3 rounded-full bg-ink/5 overflow-hidden">
                  <div className="h-full rounded-full bg-forest" style={{ width: `${(p.count / palMax) * 100}%`, minWidth: p.count ? 6 : 0 }} />
                </div>
                <span className="font-semibold text-forest text-xs whitespace-nowrap">
                  {p.count} · {p.estimate ? `≈ ${fcfa(p.estimate)}` : "—"}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-ink-mute mt-3">
            Estimation d'après le budget choisi par le client (valeur centrale du palier).
            Reste à facturer : <b className="text-forest">≈ {fcfa(s.pipeline)}</b>.
          </p>
        </Card>

        {/* avis */}
        <Card title="Avis et satisfaction"
          aside={s.reviews.pending > 0
            ? <span className="font-mono-label !text-[11px] text-aun">{s.reviews.pending} à valider</span> : undefined}>
          {s.reviews.count === 0 ? (
            <p className="text-sm text-ink-mute">Aucun avis pour le moment.</p>
          ) : (
            <div className="flex items-center gap-5">
              <div className="text-center shrink-0">
                <p className="font-display font-extrabold text-4xl text-forest leading-none">{s.reviews.avg.toFixed(1)}</p>
                <span className="flex justify-center gap-0.5 mt-2" aria-label={`${s.reviews.avg.toFixed(1)} sur 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={13} fill={n <= Math.round(s.reviews.avg) ? "#f59e0b" : "none"}
                      stroke={n <= Math.round(s.reviews.avg) ? "#f59e0b" : "#b9c8bd"} />
                  ))}
                </span>
                <p className="font-mono-label !text-[10px] text-ink-mute mt-1">{s.reviews.count} avis</p>
              </div>
              <ul className="flex-1 space-y-1.5">
                {s.reviews.stars.map((r) => (
                  <li key={r.n} className="grid grid-cols-[14px_1fr_18px] items-center gap-2 text-xs text-ink-soft">
                    <span>{r.n}</span>
                    <div className="h-2 rounded-full bg-ink/5 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${(r.count / s.reviews.count) * 100}%` }} />
                    </div>
                    <span className="text-right">{r.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}