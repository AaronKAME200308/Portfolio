// Supabase Edge Function : prévient Aaron par email
//   • quand un client envoie sa commande (client_orders : form_completed passe à true)
//   • quand un client laisse un avis (client_reviews : nouvelle ligne, à approuver)
//
// ─── Mise en place ──────────────────────────────────────────────────────────
// 1. Crée un compte gratuit sur https://resend.com et copie ta clé API.
//    (Sans domaine vérifié, Resend envoie depuis onboarding@resend.dev, et
//    UNIQUEMENT vers l'email de ton compte Resend : parfait pour te prévenir toi-même.)
// 2. Secrets de la fonction :
//      supabase secrets set RESEND_API_KEY=re_xxx WEBHOOK_SECRET=<une-longue-phrase-secrète> \
//        ADMIN_EMAIL=aaronmouele11pro@gmail.com SITE_URL=https://TON-SITE
// 3. Déploiement (le webhook n'envoie pas de JWT, d'où --no-verify-jwt) :
//      supabase functions deploy notify-order --no-verify-jwt
// 4. Supabase → Database → Webhooks → Create a new hook, deux fois :
//      • Table client_orders,  événement Update, type « Supabase Edge Functions » → notify-order
//      • Table client_reviews, événement Insert, même fonction
//    Dans chaque hook, ajoute l'en-tête HTTP :  x-webhook-secret = <ta phrase secrète>
// ────────────────────────────────────────────────────────────────────────────

type OrderRow = {
  reference: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  client_company: string | null;
  project_type: string | null;
  project_title: string | null;
  description: string | null;
  features: string | null;
  preferred_techs: string | null;
  visual_references: string | null;
  budget_range: string | null;
  budget_currency: string | null;
  deadline: string | null;
  additional_notes: string | null;
  form_completed: boolean;
};

type ReviewRow = { order_id: string; rating: number; comment: string };

type Payload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown> | null;
};

const TYPES: Record<string, string> = {
  site_vitrine: "Site vitrine",
  site_ecommerce: "E-commerce",
  application_web: "Application web",
  application_mobile: "Application mobile",
  dashboard_admin: "Dashboard / Admin",
  autre: "Autre",
};

const BUDGETS: Record<string, Record<string, string>> = {
  XAF: {
    palier_1: "Moins de 300 000 FCFA",
    palier_2: "300 000 – 600 000 FCFA",
    palier_3: "600 000 – 1 800 000 FCFA",
    palier_4: "1 800 000 – 3 000 000 FCFA",
    palier_5: "Plus de 3 000 000 FCFA",
    a_discuter: "À discuter",
  },
  USD: {
    palier_1: "Moins de 500 $",
    palier_2: "500 – 1 000 $",
    palier_3: "1 000 – 3 000 $",
    palier_4: "3 000 – 5 000 $",
    palier_5: "Plus de 5 000 $",
    a_discuter: "À discuter",
  },
};

const DEADLINES: Record<string, string> = {
  urgent_2sem: "Urgent (moins de 2 semaines)",
  "1mois": "Environ 1 mois",
  "2_3mois": "2 à 3 mois",
  plus_3mois: "Plus de 3 mois",
  flexible: "Flexible",
};

// Les textes viennent de visiteurs : on échappe tout avant de les mettre dans l'HTML
const esc = (v: unknown) =>
  String(v ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const row = (k: string, v: unknown) =>
  `<tr><td style="padding:6px 14px 6px 0;color:#4a5a50;vertical-align:top;white-space:nowrap">${esc(k)}</td>` +
  `<td style="padding:6px 0;color:#0e2f20;font-weight:600;white-space:pre-line">${esc(v)}</td></tr>`;

const wrap = (title: string, body: string, link: string) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;background:#f6f4ec;padding:24px;border-radius:16px">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#1e7b4a">Aun · nouveau</p>
  <h2 style="margin:0 0 16px;color:#0e2f20">${esc(title)}</h2>
  <table style="font-size:14px;border-collapse:collapse">${body}</table>
  <p style="margin:24px 0 0"><a href="${esc(link)}" style="background:#1e7b4a;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Ouvrir le tableau de bord</a></p>
</div>`;

async function sendMail(subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Aun <onboarding@resend.dev>",
      to: [Deno.env.get("ADMIN_EMAIL")],
      subject,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("unauthorized", { status: 401 });
  }

  const payload = (await req.json()) as Payload;
  const site = Deno.env.get("SITE_URL") ?? "";
  const admin = `${site}/admin`;

  try {
    // ── Commande envoyée par le client ──
    if (payload.table === "client_orders" && payload.type === "UPDATE") {
      const o = payload.record as unknown as OrderRow;
      const was = payload.old_record as unknown as OrderRow | null;
      if (!o.form_completed || was?.form_completed) {
        return new Response("ignored", { status: 200 }); // autre modification (statut, notes…)
      }
      const cur = o.budget_currency ?? "XAF";
      const body = [
        row("Référence", o.reference),
        row("Client", o.client_name),
        row("Email", o.client_email),
        row("Téléphone", o.client_phone),
        row("Entreprise", o.client_company),
        row("Type", TYPES[o.project_type ?? ""] ?? o.project_type),
        row("Titre", o.project_title),
        row("Budget", BUDGETS[cur]?.[o.budget_range ?? ""] ?? o.budget_range),
        row("Délai", DEADLINES[o.deadline ?? ""] ?? o.deadline),
        row("Description", o.description),
        row("Fonctionnalités", o.features),
        row("Technos", o.preferred_techs),
        row("Références", o.visual_references),
        row("Notes", o.additional_notes),
      ].join("");
      await sendMail(
        `Nouvelle commande ${o.reference} · ${TYPES[o.project_type ?? ""] ?? "Projet"}`,
        wrap(`Commande ${o.reference}`, body, admin),
      );
      return new Response("ok", { status: 200 });
    }

    // ── Avis laissé par un client ──
    if (payload.table === "client_reviews" && payload.type === "INSERT") {
      const r = payload.record as unknown as ReviewRow;
      const body = row("Note", `${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)} (${r.rating}/5)`) + row("Avis", r.comment);
      await sendMail(`Nouvel avis ${r.rating}/5 à approuver`, wrap("Nouvel avis client", body, admin));
      return new Response("ok", { status: 200 });
    }

    return new Response("ignored", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("error", { status: 500 });
  }
});