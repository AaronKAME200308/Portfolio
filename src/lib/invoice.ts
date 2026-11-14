import type { InvoiceLine } from "./stats";

/* Coordonnées affichées sur la facture */
export const BILLING = {
  brand: "Aun",
  tagline: "Développement web & mobile",
  owner: "Aaron KAME MOUELE",
  momoNumber: "+237 670 464 488",
  momoWhatsapp: "237670464488",
  email: "aaronmouele11pro@gmail.com",
  place: "Yaoundé, Cameroun",
  logo: "/Aun/aun-symbole-vert.svg",
};

export type InvoiceData = {
  number: string; issued_on: string; due_on: string;
  lines: InvoiceLine[]; discount: number; deposit: number; note: string;
  client: { name: string; email: string; phone: string; company: string; reference: string };
};

/** Génère et télécharge le PDF (bibliothèques chargées seulement au clic) */
export async function downloadInvoicePdf(node: HTMLElement, filename: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#f6f4ec", useCORS: true });
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 595.28, 841.89);
  pdf.save(filename);
}