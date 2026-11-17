// Edge Function « aun-chat » : chatbot du portfolio (Gemini ou Claude) + enregistrement d'une demande.
//
// Gemini (gratuit) :
//   supabase secrets set AI_PROVIDER=gemini GEMINI_API_KEY=xxx ALLOWED_ORIGINS=https://ton-site.vercel.app
// Claude (payant) :
//   supabase secrets set AI_PROVIDER=anthropic ANTHROPIC_API_KEY=sk-ant-xxx ALLOWED_ORIGINS=https://ton-site.vercel.app
// puis : supabase functions deploy aun-chat
// Optionnels : GEMINI_MODEL, CHAT_MODEL (Claude), DAILY_LIMIT_PER_VISITOR (40), DAILY_LIMIT_GLOBAL (1500),
//              RESEND_API_KEY + ADMIN_EMAIL (déjà utilisés par notify-order) pour être prévenu par email.
import { createClient } from "npm:@supabase/supabase-js@2";
import { systemPrompt } from "./knowledge.ts";

const PROVIDER = Deno.env.get("AI_PROVIDER") ?? "gemini";
const CLAUDE_MODEL = Deno.env.get("CHAT_MODEL") ?? "claude-haiku-5-5";
// « -latest » = Google choisit la version récente ; remplace par un nom exact vu dans Google AI Studio si besoin
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-flash-lite-latest";
const PER_VISITOR = Number(Deno.env.get("DAILY_LIMIT_PER_VISITOR") ?? 40);
const GLOBAL = Number(Deno.env.get("DAILY_LIMIT_GLOBAL") ?? 1500);
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const DEV = ["http://localhost:5173", "http://localhost:4173"];

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && [...ORIGINS, ...DEV].includes(origin) ? origin : (ORIGINS[0] ?? ""),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

const json = (body: unknown, origin: string | null, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(origin), "Content-Type": "application/json" } });

const BRIEF_DESC = "Enregistre la demande du visiteur pour qu'Aaron la reçoive. À appeler une seule fois, après accord explicite du visiteur.";
const BRIEF_SCHEMA = {
    type: "object",
    properties: {
      client_name: { type: "string", description: "Nom du visiteur" },
      client_email: { type: "string", description: "Email du visiteur" },
      project_type: { type: "string", enum: ["site_vitrine", "site_ecommerce", "application_web", "application_mobile", "dashboard_admin", "autre"] },
      description: { type: "string", description: "Description du besoin, en français, 1 à 5 phrases" },
      budget_range: { type: "string", enum: ["palier_1", "palier_2", "palier_3", "palier_4", "palier_5", "a_discuter"] },
      deadline: { type: "string", enum: ["urgent_2sem", "1mois", "2_3mois", "plus_3mois", "flexible"] },
    },
    required: ["client_name", "client_email", "description"],
};

async function sha(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function saveBrief(i: Record<string, string>, lang: string): Promise<string> {
  const name = String(i.client_name ?? "").replace(/\s+/g, " ").trim().slice(0, 120); // pas de retour à la ligne (sujet d'email)
  const email = String(i.client_email ?? "").trim().toLowerCase().slice(0, 200);
  const desc = String(i.description ?? "").trim().slice(0, 4000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || desc.length < 10) {
    return "Erreur : nom, email valide et description (10 caractères min.) sont nécessaires. Redemande ce qui manque.";
  }
  // 3 demandes par heure et par email
  const { count } = await admin.from("client_orders").select("id", { count: "exact", head: true })
    .eq("source", "contact").eq("client_email", email).gte("submitted_at", new Date(Date.now() - 3600_000).toISOString());
  if ((count ?? 0) >= 3) return "Erreur : trop de demandes pour cet email, dis-lui de réessayer plus tard.";

  const { error } = await admin.from("client_orders").insert({
    reference: "", source: "contact", client_name: name, client_email: email,
    project_type: i.project_type ?? null,
    project_title: `Contact : ${i.project_type ?? "demande"} (chatbot)`,
    description: `[Envoyé via le chatbot${lang === "en" ? " · visiteur anglophone" : ""}]\n${desc}`,
    budget_range: i.budget_range ?? null, budget_currency: "XAF", deadline: i.deadline ?? null,
    form_completed: true,
  });
  if (error) return "Erreur technique : dis au visiteur d'utiliser le formulaire de contact ou WhatsApp.";

  const key = Deno.env.get("RESEND_API_KEY"), to = Deno.env.get("ADMIN_EMAIL");
  if (key && to) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Aun <onboarding@resend.dev>", to: [to], reply_to: email,
        subject: `Nouvelle demande via le chatbot : ${name}`,
        text: `${name} <${email}>\nType : ${i.project_type ?? "—"} · Budget : ${i.budget_range ?? "—"} · Délai : ${i.deadline ?? "—"}\n\n${desc}`,
      }),
    }).catch(() => undefined);
  }
  return "OK : demande enregistrée, Aaron répondra par email.";
}

type Turn = { role: string; content: string };
type Out = { text: string; sent: boolean } | "config";
type OnBrief = (input: Record<string, string>) => Promise<string>;

// ── Gemini (Google) ──────────────────────────────────────
async function runGemini(msgs: Turn[], lang: "fr" | "en", onBrief: OnBrief): Promise<Out> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return "config";
  const call = (contents: unknown[]) =>
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(lang) }] },
        contents,
        tools: [{ functionDeclarations: [{ name: "send_brief", description: BRIEF_DESC, parameters: BRIEF_SCHEMA }] }],
        generationConfig: { maxOutputTokens: 800, temperature: 0.6 },
      }),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

  let contents: unknown[] = msgs.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  let sent = false;
  for (let step = 0; step < 3; step++) {
    const res = await call(contents);
    const parts: { text?: string; functionCall?: { name: string; args: Record<string, string> } }[] =
      res.candidates?.[0]?.content?.parts ?? [];
    const fc = parts.find((p) => p.functionCall)?.functionCall;
    if (fc?.name === "send_brief" && !sent) {
      const result = await onBrief(fc.args ?? {});
      sent = result.startsWith("OK");
      contents = [...contents, { role: "model", parts }, { role: "user", parts: [{ functionResponse: { name: "send_brief", response: { result } } }] }];
      continue;
    }
    return { text: parts.map((p) => p.text ?? "").join("").trim(), sent };
  }
  return { text: "", sent };
}

// ── Claude (Anthropic) ───────────────────────────────────
async function runClaude(msgs: Turn[], lang: "fr" | "en", onBrief: OnBrief): Promise<Out> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return "config";
  const call = (messages: unknown[]) =>
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: CLAUDE_MODEL, max_tokens: 400, system: systemPrompt(lang), messages,
        tools: [{ name: "send_brief", description: BRIEF_DESC, input_schema: BRIEF_SCHEMA }],
      }),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

  let convo: unknown[] = msgs;
  let sent = false;
  for (let step = 0; step < 3; step++) {
    const res = await call(convo);
    const toolUse = (res.content ?? []).find((c: { type: string }) => c.type === "tool_use");
    if (res.stop_reason === "tool_use" && toolUse && !sent) {
      const result = await onBrief(toolUse.input ?? {});
      sent = result.startsWith("OK");
      convo = [...convo, { role: "assistant", content: res.content },
        { role: "user", content: [{ type: "tool_result", tool_use_id: toolUse.id, content: result }] }];
      continue;
    }
    const text = (res.content ?? []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("\n").trim();
    return { text, sent };
  }
  return { text: "", sent };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "method" }, origin, 405);
  if (origin && ![...ORIGINS, ...DEV].includes(origin)) return json({ error: "origin" }, origin, 403);

  let body: { messages?: { role: string; content: string }[]; lang?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, origin, 400); }
  const lang = body.lang === "en" ? "en" : "fr";

  // messages nettoyés : 12 derniers, 600 caractères max, débute par « user »
  const msgs = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12).map((m) => ({ role: m.role, content: m.content.slice(0, 600) }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return json({ error: "empty" }, origin, 400);

  // limites d'usage (protège ta facture)
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnu";
  const visitor = await sha(`${ip}|${new Date().toISOString().slice(0, 10)}`);
  const [okV, okG] = await Promise.all([
    admin.rpc("chat_hit", { p_key: visitor, p_limit: PER_VISITOR }),
    admin.rpc("chat_hit", { p_key: "global", p_limit: GLOBAL }),
  ]);
  if (okV.data === false || okG.data === false) return json({ error: "limit" }, origin, 429);

  try {
    const onBrief = (input: Record<string, string>) => saveBrief(input, lang);
    const out = PROVIDER === "anthropic" ? await runClaude(msgs, lang, onBrief) : await runGemini(msgs, lang, onBrief);
    if (out === "config") return json({ error: "config" }, origin, 500);
    const text = out.text || (lang === "en" ? "Hmm, I lost my words. Try again?" : "Oups, j'ai perdu mes mots. Tu peux répéter ?");
    return json({ reply: text, sent: out.sent }, origin);
  } catch {
    return json({ error: "upstream" }, origin, 502);
  }
});