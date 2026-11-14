import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, Plus, Trash2, X } from "lucide-react";
import supabase from "../../services/supabase";
import InvoiceSheet from "./InvoiceSheet";
import { downloadInvoicePdf, type InvoiceData } from "../../lib/invoice";
import { fcfa, invoiceTotal, type InvoiceLine } from "../../lib/stats";

export type Invoice = {
  id: string; order_id: string; number: string; issued_on: string; due_on: string;
  lines: InvoiceLine[]; discount: number; deposit: number; note: string | null; paid: boolean;
};
type OrderLite = {
  id: string; reference: string; client_name: string | null; client_email: string | null;
  client_phone: string | null; client_company: string | null; project_title: string | null;
};

const DEFAULT_NOTE =
  "Merci pour votre confiance.\nPaiement par MTN Mobile Money au numéro indiqué, en précisant le numéro de facture en motif.";
const inputCls =
  "w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-aun focus:ring-4 focus:ring-aun/15";
const keyGreen = "[--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]";
const keyWhite = "[--key-face:#ffffff] [--key-edge:#b9c8bd] [--key-text:#0e2f20]";
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function InvoiceEditor({
  order, invoice, onClose, onSaved,
}: { order: OrderLite; invoice: Invoice | null; onClose: () => void; onSaved: () => void }) {
  const today = new Date();
  const [lines, setLines] = useState<InvoiceLine[]>(
    invoice?.lines?.length ? invoice.lines : [{ label: order.project_title?.replace(/^Contact : /, "") || "Prestation", price: 0, qty: 1 }],
  );
  const [issued, setIssued] = useState(invoice?.issued_on ?? iso(today));
  const [due, setDue] = useState(invoice?.due_on ?? iso(new Date(today.getTime() + 15 * 86_400_000)));
  const [discount, setDiscount] = useState(String(invoice?.discount ?? 0));
  const [deposit, setDeposit] = useState(String(invoice?.deposit ?? 0));
  const [note, setNote] = useState(invoice?.note ?? DEFAULT_NOTE);
  const [paid, setPaid] = useState(invoice?.paid ?? false);
  const [number, setNumber] = useState(invoice?.number ?? "");
  const [busy, setBusy] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [err, setErr] = useState("");
  const [scale, setScale] = useState(0.5);
  const wrap = useRef<HTMLDivElement>(null);
  const full = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => wrap.current && setScale(Math.min(1, wrap.current.clientWidth / 794));
    fit();
    window.addEventListener("resize", fit);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("resize", fit); document.body.style.overflow = ""; };
  }, []);

  const data: InvoiceData = useMemo(() => ({
    number: number || "FAC-AAAA-0000",
    issued_on: issued, due_on: due, lines, discount: Number(discount) || 0, deposit: Number(deposit) || 0, note,
    client: {
      name: order.client_name ?? "", email: order.client_email ?? "", phone: order.client_phone ?? "",
      company: order.client_company ?? "", reference: order.reference,
    },
  }), [number, issued, due, lines, discount, deposit, note, order]);

  const setLine = (i: number, patch: Partial<InvoiceLine>) =>
    setLines((l) => l.map((x, k) => (k === i ? { ...x, ...patch } : x)));

  const save = async (): Promise<string | null> => {
    setErr("");
    const clean = lines.filter((l) => l.label.trim() && Number(l.price) > 0 && Number(l.qty) > 0)
      .map((l) => ({ label: l.label.trim(), price: Number(l.price), qty: Number(l.qty) }));
    if (!clean.length) { setErr("Ajoutez au moins une ligne avec un prix."); return null; }
    setBusy(true);
    const row = {
      order_id: order.id, issued_on: issued, due_on: due, lines: clean,
      discount: Number(discount) || 0, deposit: Number(deposit) || 0, note: note.trim() || null, paid,
    };
    const res = invoice
      ? await supabase.from("invoices").update(row).eq("id", invoice.id).select("number").single()
      : await supabase.from("invoices").insert({ ...row, number: "" }).select("number").single();
    setBusy(false);
    if (res.error || !res.data) { setErr("Enregistrement impossible (la migration admin_v3.sql est-elle exécutée ?)."); return null; }
    setNumber(res.data.number);
    setLines(clean);
    onSaved();
    return res.data.number;
  };

  const pdf = async () => {
    const n = number || (await save());
    if (!n) return;
    setPdfBusy(true);
    // laisse React afficher le nouveau numéro avant la capture
    await new Promise((r) => setTimeout(r, 350));
    try { if (full.current) await downloadInvoicePdf(full.current, `${n}.pdf`); }
    catch { setErr("Le PDF n'a pas pu être créé."); }
    setPdfBusy(false);
  };

  const total = invoiceTotal(data);

  return (
    <div className="fixed inset-0 z-[100] bg-forest/70 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" aria-label="Facture">
      <div className="min-h-full flex items-start justify-center p-3 sm:p-6">
        <div className="w-full max-w-6xl rounded-3xl bg-cream shadow-2xl">
          <div className="flex items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b-2 border-dashed border-ink/15">
            <div>
              <p className="font-mono-label text-aun">{invoice ? "Modifier la facture" : "Nouvelle facture"}</p>
              <h2 className="font-display font-extrabold text-xl text-forest">{order.reference} · {order.client_name || "Client"}</h2>
            </div>
            <button onClick={onClose} aria-label="Fermer" className="p-2 rounded-lg hover:bg-ink/5"><X size={20} /></button>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 p-5 sm:p-7">
            {/* formulaire */}
            <div className="space-y-5 min-w-0">
              <div>
                <p className="font-mono-label text-ink-soft mb-2">Lignes</p>
                <div className="space-y-3">
                  {lines.map((l, i) => (
                    <div key={i} className="rounded-2xl bg-white border-2 border-ink/10 p-3 space-y-2">
                      <input className={inputCls} placeholder="Désignation" value={l.label} onChange={(e) => setLine(i, { label: e.target.value })} />
                      <div className="grid grid-cols-[1fr_72px_auto] gap-2 items-center">
                        <input className={inputCls} type="number" min={0} inputMode="numeric" placeholder="Prix (FCFA)"
                          value={l.price || ""} onChange={(e) => setLine(i, { price: Number(e.target.value) })} />
                        <input className={inputCls} type="number" min={1} inputMode="numeric" aria-label="Quantité"
                          value={l.qty} onChange={(e) => setLine(i, { qty: Number(e.target.value) })} />
                        <button type="button" aria-label="Supprimer la ligne" disabled={lines.length === 1}
                          onClick={() => setLines((x) => x.filter((_, k) => k !== i))}
                          className="p-2 rounded-lg text-ink-mute hover:text-red-600 disabled:opacity-30"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setLines((l) => [...l, { label: "", price: 0, qty: 1 }])}
                  className={`keycap mt-3 px-4 py-2 text-xs font-semibold ${keyWhite}`}><Plus size={14} /> Ajouter une ligne</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="font-mono-label !text-[10px] text-ink-soft">Remise (FCFA)</span>
                  <input className={`${inputCls} mt-1`} type="number" min={0} value={discount} onChange={(e) => setDiscount(e.target.value)} /></label>
                <label className="block"><span className="font-mono-label !text-[10px] text-ink-soft">Acompte déjà payé</span>
                  <input className={`${inputCls} mt-1`} type="number" min={0} value={deposit} onChange={(e) => setDeposit(e.target.value)} /></label>
                <label className="block"><span className="font-mono-label !text-[10px] text-ink-soft">Date</span>
                  <input className={`${inputCls} mt-1`} type="date" value={issued} onChange={(e) => setIssued(e.target.value)} /></label>
                <label className="block"><span className="font-mono-label !text-[10px] text-ink-soft">Échéance</span>
                  <input className={`${inputCls} mt-1`} type="date" value={due} onChange={(e) => setDue(e.target.value)} /></label>
              </div>

              <label className="block"><span className="font-mono-label !text-[10px] text-ink-soft">Message en bas de facture</span>
                <textarea rows={3} className={`${inputCls} mt-1`} value={note} onChange={(e) => setNote(e.target.value)} /></label>

              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="h-4 w-4 accent-[#1e7b4a]" />
                Facture payée
              </label>

              <p className="text-sm text-ink-soft">Total : <b className="text-forest">{fcfa(total)}</b></p>
              {err && <p className="text-sm text-red-600" role="alert">{err}</p>}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={save} disabled={busy} className={`keycap px-5 py-3 text-sm font-semibold disabled:opacity-70 ${keyWhite}`}>
                  {busy && <Loader2 size={15} className="animate-spin" />} Enregistrer
                </button>
                <button type="button" onClick={pdf} disabled={busy || pdfBusy} className={`keycap px-5 py-3 text-sm font-semibold disabled:opacity-70 ${keyGreen}`}>
                  {pdfBusy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} Télécharger le PDF
                </button>
              </div>
            </div>

            {/* aperçu */}
            <div ref={wrap} className="min-w-0">
              <p className="font-mono-label text-ink-soft mb-2">Aperçu</p>
              <div className="rounded-2xl overflow-hidden border-2 border-ink/10 bg-white" style={{ height: 1123 * scale }}>
                <div style={{ width: 794, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                  <InvoiceSheet data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* version pleine taille, hors écran, utilisée pour le PDF */}
      <div aria-hidden="true" style={{ position: "fixed", left: -10000, top: 0 }}>
        <InvoiceSheet ref={full} data={data} />
      </div>
    </div>
  );
}