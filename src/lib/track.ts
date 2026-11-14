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

export function trackVisit(lang: "fr" | "en") {
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
    })
    .then(() => undefined, () => undefined);
}