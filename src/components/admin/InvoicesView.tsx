import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronRight, FileText } from "lucide-react";
import supabase from "../../services/supabase";
import { dateFr, downloadCsv, inputCls, keyGreen, keyWhite, useList, type Order, type SortDef } from "../../lib/adminData";
import { fcfa, invoiceTotal } from "../../lib/stats";
import InvoiceEditor, { type Invoice } from "./InvoiceEditor";
import { Chips, Empty, PageTitle, Pager, Toolbar } from "./ui";

const due = (i: Invoice) => Math.max(0, invoiceTotal(i) - (Number(i.deposit) || 0));

export function InvoicesList({ invoices, orders, onChanged }: { invoices: Invoice[]; orders: Order[]; onChanged: () => Promise<void> }) {
  const nav = useNavigate();
  const ord = (id: string) => orders.find((o) => o.id === id);
  const [filter, setFilter] = useState<"all" | "due" | "paid">("all");
  const [pick, setPick] = useState("");
  const [creating, setCreating] = useState<Order | null>(null);

  const sorts: SortDef<Invoice>[] = [
    { id: "recent", label: "Plus récentes", cmp: (a, b) => b.issued_on.localeCompare(a.issued_on) || b.number.localeCompare(a.number) },
    { id: "old", label: "Plus anciennes", cmp: (a, b) => a.issued_on.localeCompare(b.issued_on) },
    { id: "amount", label: "Montant ↓", cmp: (a, b) => invoiceTotal(b) - invoiceTotal(a) },
    { id: "client", label: "Client A → Z", cmp: (a, b) => (ord(a.order_id)?.client_name ?? "").localeCompare(ord(b.order_id)?.client_name ?? "", "fr") },
  ];
  const shown = invoices.filter((i) => filter === "all" || (filter === "paid") === i.paid);
  const L = useList(shown, (i) => `${i.number} ${ord(i.order_id)?.client_name ?? ""} ${ord(i.order_id)?.reference ?? ""}`, sorts);
  const toCollect = invoices.filter((i) => !i.paid).reduce((s, i) => s + due(i), 0);
  const collected = invoices.filter((i) => i.paid).reduce((s, i) => s + invoiceTotal(i), 0);

  const togglePaid = async (i: Invoice) => {
    await supabase.from("invoices").update({ paid: !i.paid }).eq("id", i.id);
    await onChanged();
  };

  return (
    <div className="space-y-4">
      <PageTitle title="Factures" sub={`Encaissé ${fcfa(collected)} · à encaisser ${fcfa(toCollect)}`} />

      <div className="rounded-2xl bg-white/70 border-2 border-ink/10 p-4 grid sm:grid-cols-[1fr_auto] gap-3">
        <select className={inputCls} value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Commande à facturer">
          <option value="">Nouvelle facture pour… (choisir une commande)</option>
          {orders.map((o) => <option key={o.id} value={o.id}>{o.reference} · {o.client_name || "Client sans nom"}</option>)}
        </select>
        <button type="button" disabled={!pick} onClick={() => setCreating(ord(pick) ?? null)}
          className={`keycap px-5 py-2.5 text-sm font-semibold disabled:opacity-50 ${keyGreen}`}><FileText size={15} /> Créer</button>
      </div>

      <Toolbar q={L.q} onQ={L.setQ} sort={L.sort} onSort={L.setSort} sorts={sorts} placeholder="Numéro, client, référence…"
        onExport={() => downloadCsv("factures.csv", ["Numéro", "Date", "Échéance", "Client", "Commande", "Total FCFA", "Acompte", "Payée"],
          L.all.map((i) => [i.number, i.issued_on, i.due_on, ord(i.order_id)?.client_name, ord(i.order_id)?.reference, invoiceTotal(i), i.deposit, i.paid ? "oui" : "non"]))} />
      <Chips value={filter} onChange={(v) => { setFilter(v); L.setPage(0); }}
        options={[{ value: "all", label: "Toutes", count: invoices.length },
          { value: "due", label: "À payer", count: invoices.filter((i) => !i.paid).length },
          { value: "paid", label: "Payées", count: invoices.filter((i) => i.paid).length }]} />

      {L.rows.length === 0 ? <Empty>Aucune facture.</Empty> : (
        <ul className="space-y-2.5">
          {L.rows.map((i) => (
            <li key={i.id} className="rounded-2xl bg-white border-2 border-ink/10 p-3.5 sm:p-4">
              <button type="button" onClick={() => nav(`/admin/factures/${i.id}`)} className="w-full flex items-center gap-3 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold text-forest truncate">{i.number} · {ord(i.order_id)?.client_name || "Client"}</span>
                  <span className="block font-mono-label !text-[10px] text-ink-mute mt-0.5">{dateFr(i.issued_on)} · échéance {dateFr(i.due_on)}</span>
                </span>
                <span className="text-right shrink-0">
                  <span className="block font-semibold text-forest text-sm whitespace-nowrap">{fcfa(invoiceTotal(i))}</span>
                  <span className={`inline-block mt-1 font-mono-label !text-[10px] rounded-md px-2 py-0.5 ${i.paid ? "bg-aun/15 text-aun" : "bg-amber-100 text-amber-700"}`}>
                    {i.paid ? "Payée" : "À payer"}
                  </span>
                </span>
                <ChevronRight size={18} className="text-ink-mute shrink-0" />
              </button>
              <div className="mt-3 pt-3 border-t border-dashed border-ink/15">
                <button type="button" onClick={() => togglePaid(i)} className={`keycap px-4 py-2 text-xs font-semibold ${keyWhite}`}>
                  <Check size={14} /> {i.paid ? "Marquer à payer" : "Marquer payée"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={L.page} pages={L.pages} total={L.all.length} onPage={L.setPage} />
      {creating && <InvoiceEditor order={creating} invoice={null} onClose={() => { setCreating(null); setPick(""); }} onSaved={() => void onChanged()} />}
    </div>
  );
}

/** /admin/factures/:id : la facture s'ouvre dans l'éditeur */
export function InvoicePage({ invoices, orders, onChanged }: { invoices: Invoice[]; orders: Order[]; onChanged: () => Promise<void> }) {
  const { id } = useParams();
  const nav = useNavigate();
  const inv = invoices.find((i) => i.id === id);
  const order = orders.find((o) => o.id === inv?.order_id);
  if (!inv || !order) return <Empty>Facture introuvable (supprimée ?).</Empty>;
  return <InvoiceEditor key={inv.id} order={order} invoice={inv} onClose={() => nav("/admin/factures")} onSaved={() => void onChanged()} />;
}