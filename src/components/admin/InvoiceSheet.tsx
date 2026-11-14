import { forwardRef, useEffect, useState } from "react";
import { fcfa, invoiceTotal } from "../../lib/stats";
import { BILLING, type InvoiceData } from "../../lib/invoice";

const FOREST = "#0e2f20", CREAM = "#f6f4ec", GREEN = "#1e7b4a", SAGE = "#dceadd", MUTE = "#5b6b60";
const dateFr = (iso: string) =>
  iso ? new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "";

/** Facture A4 (794 × 1123 px), dessinée en styles inline pour être exportée telle quelle en PDF */
const InvoiceSheet = forwardRef<HTMLDivElement, { data: InvoiceData }>(({ data }, ref) => {
  const [qr, setQr] = useState("");
  const subtotal = data.lines.reduce((s, l) => s + (Number(l.price) || 0) * (Number(l.qty) || 0), 0);
  const total = invoiceTotal(data);
  const rest = Math.max(0, total - (Number(data.deposit) || 0));

  useEffect(() => {
    let alive = true;
    import("qrcode").then((m) =>
      m.toDataURL(
        `https://wa.me/${BILLING.momoWhatsapp}?text=${encodeURIComponent(`Bonjour, paiement de la facture ${data.number}`)}`,
        { margin: 1, width: 220, color: { dark: FOREST, light: "#ffffff" } },
      ),
    ).then((u) => alive && setQr(u)).catch(() => undefined);
    return () => { alive = false; };
  }, [data.number]);

  const label: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase" };

  return (
    <div ref={ref} style={{ width: 794, height: 1123, background: CREAM, position: "relative", overflow: "hidden",
      fontFamily: "'Outfit', 'Nunito Sans', sans-serif", color: FOREST, boxSizing: "border-box", padding: "56px 56px 0" }}>

      {/* ── Panneau gauche : dates + client ── */}
      <div style={{ position: "absolute", left: 56, top: 128, width: 232, height: 318, background: FOREST, color: CREAM, padding: "70px 24px 24px", boxSizing: "border-box", borderRadius: 4 }}>
        <div style={{ position: "absolute", left: 24, top: -52, width: 104, height: 104, background: "#fff", padding: 6, boxSizing: "border-box", borderRadius: 4 }}>
          {qr && <img src={qr} alt="" style={{ width: "100%", height: "100%", display: "block" }} />}
        </div>
        <p style={{ ...label, color: "#6baf7b", margin: 0 }}>Date</p>
        <p style={{ margin: "3px 0 14px", fontSize: 14 }}>{dateFr(data.issued_on)}</p>
        <p style={{ ...label, color: "#6baf7b", margin: 0 }}>Échéance</p>
        <p style={{ margin: "3px 0 0", fontSize: 14 }}>{dateFr(data.due_on)}</p>
        <div style={{ width: 28, height: 1, background: "#6baf7b", margin: "18px 0" }} />
        <p style={{ ...label, color: "#6baf7b", margin: 0 }}>Facturé à</p>
        <p style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 700 }}>{data.client.name || "—"}</p>
        {data.client.company && <p style={{ margin: "2px 0 0", fontSize: 12.5, opacity: .85 }}>{data.client.company}</p>}
        {data.client.phone && <p style={{ margin: "8px 0 0", fontSize: 12.5 }}>{data.client.phone}</p>}
        {data.client.email && <p style={{ margin: "2px 0 0", fontSize: 12.5, wordBreak: "break-all" }}>{data.client.email}</p>}
      </div>

      {/* ── En-tête droite ── */}
      <div style={{ position: "absolute", left: 340, top: 64, right: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={BILLING.logo} alt="" crossOrigin="anonymous" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 19, lineHeight: 1.1 }}>{BILLING.brand}</p>
            <p style={{ margin: 0, fontSize: 11.5, color: MUTE }}>{BILLING.tagline}</p>
          </div>
        </div>
        <h1 style={{ margin: "28px 0 0", fontSize: 76, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: FOREST }}>FACTURE</h1>
        <p style={{ margin: "14px 0 0", fontSize: 12.5, color: MUTE }}>Document de paiement</p>

        <div style={{ marginTop: 20, background: "#fff", display: "flex", padding: "14px 0", textAlign: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11.5, color: MUTE }}>Commande</p>
            <p style={{ margin: "3px 0 0", fontSize: 13.5, fontWeight: 600 }}>{data.client.reference}</p>
          </div>
          <div style={{ width: 1, background: SAGE }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11.5, color: MUTE }}>Facture n°</p>
            <p style={{ margin: "3px 0 0", fontSize: 13.5, fontWeight: 600 }}>{data.number}</p>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", gap: 26 }}>
          <div style={{ width: 84 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, lineHeight: 1.3 }}>Moyen de paiement</p>
            <div style={{ width: 22, height: 2, background: FOREST, marginTop: 8 }} />
          </div>
          <div style={{ fontSize: 13, color: MUTE, lineHeight: 1.55 }}>
            <p style={{ margin: 0, color: FOREST, fontWeight: 600 }}>MTN Mobile Money</p>
            <p style={{ margin: 0 }}>Titulaire : {BILLING.owner}</p>
            <p style={{ margin: 0 }}>Numéro : {BILLING.momoNumber}</p>
            <p style={{ margin: 0 }}>Motif : {data.number}</p>
          </div>
        </div>
      </div>

      {/* ── Tableau ── */}
      <div style={{ position: "absolute", left: 56, right: 56, top: 470 }}>
        <div style={{ background: FOREST, color: CREAM, display: "grid", gridTemplateColumns: "1fr 110px 50px 130px", padding: "16px 24px", fontWeight: 600, fontSize: 13 }}>
          <span>Désignation</span><span style={{ textAlign: "right" }}>Prix unit.</span><span style={{ textAlign: "center" }}>Qté</span><span style={{ textAlign: "right" }}>Sous-total</span>
        </div>
        <div style={{ background: "#fff", padding: "22px 24px 18px", minHeight: 170, boxSizing: "border-box" }}>
          {data.lines.map((l, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 110px 50px 130px", padding: "7px 0", fontSize: 13.5, alignItems: "start" }}>
              <span style={{ paddingRight: 12 }}>{l.label || "—"}</span>
              <span style={{ textAlign: "right" }}>{fcfa(Number(l.price) || 0).replace(" FCFA", "")}</span>
              <span style={{ textAlign: "center" }}>{l.qty}</span>
              <span style={{ textAlign: "right", fontWeight: 600 }}>{fcfa((Number(l.price) || 0) * (Number(l.qty) || 0)).replace(" FCFA", "")}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", padding: "0 24px 22px", borderTop: `1px solid ${SAGE}`, marginTop: -1 }}>
          <div style={{ marginLeft: "auto", width: 330, paddingTop: 16, fontSize: 13.5 }}>
            {[
              ["Sous-total", fcfa(subtotal), false],
              ...(data.discount > 0 ? [["Remise", `− ${fcfa(data.discount)}`, false] as const] : []),
              ["Total", fcfa(total), true],
              ...(data.deposit > 0 ? [["Acompte versé", `− ${fcfa(data.deposit)}`, false] as const] : []),
            ].map(([k, v, bold]) => (
              <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontWeight: bold ? 700 : 500 }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, background: GREEN, color: "#fff", padding: "11px 14px", borderRadius: 4, fontWeight: 700, fontSize: 15 }}>
              <span>{data.deposit > 0 ? "Reste à payer" : "Net à payer"}</span><span>{fcfa(rest)}</span>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 10.5, color: MUTE, textAlign: "right" }}>TVA non applicable</p>
          </div>
        </div>
      </div>

      {/* ── Pied de page ── */}
      <div style={{ position: "absolute", left: 56, right: 56, bottom: 44, display: "flex", gap: 40, alignItems: "flex-start" }}>
        <p style={{ flex: 1, margin: 0, fontSize: 12, lineHeight: 1.6, color: MUTE, whiteSpace: "pre-line" }}>{data.note}</p>
        <div style={{ width: 250, fontSize: 12, lineHeight: 1.5 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>E-mail</p>
          <p style={{ margin: "0 0 8px", color: MUTE }}>{BILLING.email}</p>
          <p style={{ margin: 0, fontWeight: 700 }}>Adresse</p>
          <p style={{ margin: 0, color: MUTE }}>{BILLING.place}</p>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: FOREST }} />
    </div>
  );
});
InvoiceSheet.displayName = "InvoiceSheet";
export default InvoiceSheet;