import supabase from "../services/supabase";

// Comptage de visites anonyme : aucun cookie, aucune IP.
// Un identifiant aléatoire reste dans le navigateur pour ne compter qu'une visite par personne et par 30 min.
const KEY = "aun-vid";

const visitorId = () => {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID().replace(/-/g, "");
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }
};

// Robots qui exécutent du JavaScript (aperçus de liens, audits, navigateurs automatisés)
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|node-fetch|axios|vercel|uptime|monitor|phantom|puppeteer|playwright/i;

const kindOf = (): "human" | "bot" | "owner" => {
  try { if (localStorage.getItem("aun-owner") === "1") return "owner"; } catch { /* ignore */ }
  if (navigator.webdriver || BOT_RE.test(navigator.userAgent)) return "bot";
  return "human";
};

export function trackVisit() {
  let lang: "fr" | "en" = "fr";
  try { if (localStorage.getItem("aun-lang") === "en") lang = "en"; } catch { /* ignore */ }
  try {
    // L'admin ne se compte pas lui-même
    if (sessionStorage.getItem("aun-tracked")) return;
    sessionStorage.setItem("aun-tracked", "1");
  } catch { /* ignore */ }

  const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
  void supabase
    .rpc("track_visit", {
      p_visitor: visitorId(),
      p_page: window.location.pathname,
      p_lang: lang,
      p_device: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
      p_referrer: ref,
      p_kind: kindOf(),
    })
    .then(() => undefined, () => undefined);
}
