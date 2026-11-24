import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Send, Volume2, VolumeX, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import supabase from "../services/supabase";
import { useLang } from "../lib/i18n";
import Mascot, { type Mood } from "./Mascot";

const WHATSAPP_NUMBER = "237670464488";
const KEY = "aun-chat";

type Msg = { role: "user" | "assistant"; content: string };

const TXT = {
  fr: {
    name: "Aun", sub: "Pose-moi une question sur Aaron",
    hello: "Salut ! Moi c'est Aun 👋 Je peux te parler des services d'Aaron, de ses projets, des budgets… ou t'aider à lui envoyer ta demande. Qu'est-ce qui t'amène ?",
    nudges: {
      arrive: ["Salut ! Moi c'est Aun 👋 Je peux te guider sur le site si tu veux.", "Bienvenue ! Une question sur ce que fait Aaron ?"],
      idle: ["Tu cherches quelque chose ? Je peux t'aider 🙂", "Un projet en tête ? Raconte-moi, ça prend 1 minute.", "Psst… je connais les tarifs et les délais par cœur 😉"],
      projects: "Tu veux que je te présente les projets en un clic ? 👀",
      skills: "Une techno en particulier ? Demande-moi ce qu'Aaron maîtrise 💡",
      about: "Envie d'en savoir plus sur Aaron ? Je te raconte 🙂",
      contact: "Prêt à lancer ton projet ? Je prépare ta demande avec toi 🚀",
    },
    sound: "Son des notifications", soundOff: "Couper le son",
    placeholder: "Écris ton message…", send: "Envoyer", open: "Discuter avec Aun", close: "Fermer le chat",
    privacy: "Tes messages sont traités par une IA tierce (Google). Évite les infos sensibles.", privacyLink: "Confidentialité", wa: "Continuer sur WhatsApp", form: "Ouvrir le formulaire",
    quick: ["Quels services proposes-tu ?", "Combien ça coûte ?", "Montre-moi des projets", "Je veux lancer un projet"],
    errGeneric: "Oups, je n'arrive pas à répondre pour l'instant. Tu peux écrire directement à Aaron sur WhatsApp 👇",
    errLimit: "J'ai beaucoup discuté aujourd'hui, je fais une pause ! Écris plutôt à Aaron sur WhatsApp 👇",
    waMsg: "Bonjour, je souhaite discuter d'un projet avec vous.",
    sent: "Demande envoyée à Aaron",
  },
  en: {
    name: "Aun", sub: "Ask me anything about Aaron",
    hello: "Hey! I'm Aun 👋 I can tell you about Aaron's services, his projects, budgets… or help you send him your request. What brings you here?",
    nudges: {
      arrive: ["Hey! I'm Aun 👋 I can show you around if you like.", "Welcome! Any question about what Aaron does?"],
      idle: ["Looking for something? I can help 🙂", "Got a project in mind? Tell me, it takes a minute.", "Psst… I know the prices and timelines by heart 😉"],
      projects: "Want me to show you the projects in one click? 👀",
      skills: "A specific tech? Ask me what Aaron masters 💡",
      about: "Want to know more about Aaron? I'll tell you 🙂",
      contact: "Ready to start your project? I'll prepare your request with you 🚀",
    },
    sound: "Notification sound", soundOff: "Mute sound",
    placeholder: "Type your message…", send: "Send", open: "Chat with Aun", close: "Close chat",
    privacy: "Your messages are processed by a third-party AI (Google). Avoid sensitive info.", privacyLink: "Privacy", wa: "Continue on WhatsApp", form: "Open the form",
    quick: ["What services do you offer?", "How much does it cost?", "Show me some projects", "I want to start a project"],
    errGeneric: "Oops, I can't answer right now. You can message Aaron directly on WhatsApp 👇",
    errLimit: "I've talked a lot today, taking a break! Message Aaron on WhatsApp instead 👇",
    waMsg: "Hello, I would like to discuss a project with you.",
    sent: "Request sent to Aaron",
  },
};

/* ── Réponses à boutons (écrites ici, sans IA) ── */
type MenuId = "start" | "services" | "tarifs" | "delais" | "brief_type" | "brief_budget" | "brief_delai" | "brief_confirm";
type Ui = { t: "menu"; id: MenuId } | { t: "projects" };
type Shown = Msg & { actions?: ("WA" | "FORM")[]; sent?: boolean; error?: boolean; ui?: Ui };
type Opt = { id: string; label: string };
type Step = "type" | "budget" | "delai" | "name" | "email" | "message" | "confirm";
type Flow = { step: Step; d: { type?: string; budget?: string; delai?: string; name?: string; email?: string; message?: string } } | null;

const L2 = {
  fr: {
    more: "Autre chose ?",
    servicesIntro: "Voilà ce qu'Aaron fait. Clique sur un service pour en savoir plus :",
    tarifsIntro: "Voici les fourchettes de budget (en FCFA). Clique sur une tranche :",
    delaisIntro: "Quel délai t'intéresse ?",
    projectsIntro: "Voici les projets d'Aaron. Clique sur une carte pour ouvrir le site :",
    tarifsNote: "Le devis exact dépend de ton besoin : Aaron te le donne après avoir échangé avec toi.",
    delaisNote: "Aaron confirme toujours le planning après avoir vu ton besoin.",
    start: [
      { id: "services", label: "Quels services proposes-tu ?" }, { id: "tarifs", label: "Combien ça coûte ?" },
      { id: "projets", label: "Montre-moi des projets" }, { id: "delais", label: "Quels délais ?" },
      { id: "brief", label: "Je veux lancer un projet" },
    ] as Opt[],
    svcOpts: [
      { id: "site", label: "Site web" }, { id: "ecom", label: "E-commerce" }, { id: "app", label: "Application web" },
      { id: "mobile", label: "Application mobile" }, { id: "api", label: "API / Back-end" }, { id: "ia", label: "IA / Vision" },
    ] as Opt[],
    svc: {
      site: "Sites vitrines, portfolios et plateformes : de la maquette à la mise en ligne, rapides et adaptés au mobile.",
      ecom: "Une boutique en ligne pour vendre tes produits.",
      app: "Applications web sur mesure : outils métier, dashboards et back-offices.",
      mobile: "Applications mobiles Android et iOS avec React Native, branchées à une API et une base de données.",
      api: "APIs robustes (FastAPI, Node.js/Express, Symfony) et bases de données PostgreSQL ou Supabase.",
      ia: "Entraînement et intégration de modèles de vision par ordinateur, comme PlantGuard AI qui détecte les maladies des plantes.",
    } as Record<string, string>,
    tarifOpts: [
      { id: "palier_1", label: "Moins de 300 000 FCFA" }, { id: "palier_2", label: "300 000 – 600 000 FCFA" },
      { id: "palier_3", label: "600 000 – 1 800 000 FCFA" }, { id: "palier_4", label: "1 800 000 – 3 000 000 FCFA" },
      { id: "palier_5", label: "Plus de 3 000 000 FCFA" }, { id: "a_discuter", label: "À discuter" },
    ] as Opt[],
    tarif: {
      palier_1: "Pour un petit projet simple ou un besoin encore à préciser.",
      palier_2: "Pour un projet de taille modeste.",
      palier_3: "Pour un projet de taille moyenne avec plusieurs fonctionnalités.",
      palier_4: "Pour un projet ambitieux ou une application plus complète.",
      palier_5: "Pour un grand projet sur mesure.",
      a_discuter: "Pas de souci : décris ton idée à Aaron, il te proposera un budget adapté.",
    } as Record<string, string>,
    delaiOpts: [
      { id: "urgent_2sem", label: "Urgent (moins de 2 semaines)" }, { id: "1mois", label: "Environ 1 mois" },
      { id: "2_3mois", label: "2 à 3 mois" }, { id: "plus_3mois", label: "Plus de 3 mois" }, { id: "flexible", label: "Je suis flexible" },
    ] as Opt[],
    delai: {
      urgent_2sem: "Possible selon la disponibilité d'Aaron : à confirmer directement avec lui.",
      "1mois": "Un délai réaliste pour un projet bien cadré, selon sa taille.",
      "2_3mois": "Confortable pour un projet plus complet.",
      plus_3mois: "Adapté aux gros projets, avec des livraisons par étapes.",
      flexible: "Parfait : Aaron te proposera un planning qui s'adapte à ton rythme.",
    } as Record<string, string>,
    briefTypes: [
      { id: "web", label: "Site web" }, { id: "app", label: "Application web" }, { id: "mobile", label: "Application mobile" },
      { id: "api", label: "API / Back-end" }, { id: "ia", label: "IA / Vision" }, { id: "autre", label: "Autre idée" },
    ] as Opt[],
    briefType: "Super ! On construit quoi ?", briefBudget: "Quel budget as-tu en tête ? Une estimation suffit.",
    briefDelai: "Et pour quand ?", briefName: "Comment tu t'appelles ?", briefEmail: "Ton email, pour qu'Aaron puisse te répondre ?",
    briefMsg: "Décris ton projet en quelques phrases.",
    badName: "J'ai besoin de ton nom (2 lettres minimum).", badEmail: "Cet email n'a pas l'air valide, tu peux vérifier ?",
    badMsg: "Un peu plus de détails s'il te plaît (10 caractères minimum).",
    confirmOpts: [{ id: "send", label: "Envoyer à Aaron" }, { id: "cancel", label: "Annuler" }] as Opt[],
    confirmQ: "Je l'envoie à Aaron ?",
    sentOk: "C'est envoyé ! Aaron te répond par email sous 24h.",
    sentErr: "Je n'ai pas pu l'envoyer. Tu peux écrire directement à Aaron sur WhatsApp 👇",
    cancelled: "Pas de souci, j'ai annulé.", cancelBtn: "Annuler le brief",
    recap: { type: "Projet", budget: "Budget", delai: "Délai", name: "Nom", email: "Email", message: "Message" },
    ph: { name: "Ton nom…", email: "ton@email.com", message: "Décris ton projet…" },
    projTitle: "Voir le site", projCode: "Voir le code",
  },
  en: {
    more: "Anything else?",
    servicesIntro: "Here's what Aaron does. Tap a service to learn more:",
    tarifsIntro: "Here are the budget ranges (in FCFA). Tap one:",
    delaisIntro: "Which timeline are you thinking of?",
    projectsIntro: "Here are Aaron's projects. Tap a card to open the site:",
    tarifsNote: "The exact quote depends on your needs: Aaron gives it after talking with you.",
    delaisNote: "Aaron always confirms the schedule after seeing your needs.",
    start: [
      { id: "services", label: "What services do you offer?" }, { id: "tarifs", label: "How much does it cost?" },
      { id: "projets", label: "Show me some projects" }, { id: "delais", label: "What timelines?" },
      { id: "brief", label: "I want to start a project" },
    ] as Opt[],
    svcOpts: [
      { id: "site", label: "Website" }, { id: "ecom", label: "E-commerce" }, { id: "app", label: "Web application" },
      { id: "mobile", label: "Mobile application" }, { id: "api", label: "API / Back-end" }, { id: "ia", label: "AI / Vision" },
    ] as Opt[],
    svc: {
      site: "Showcase sites, portfolios and platforms: from mockup to launch, fast and mobile-friendly.",
      ecom: "An online store to sell your products.",
      app: "Custom web apps: business tools, dashboards and back-offices.",
      mobile: "Android and iOS mobile apps with React Native, connected to an API and a database.",
      api: "Robust APIs (FastAPI, Node.js/Express, Symfony) and PostgreSQL or Supabase databases.",
      ia: "Training and integrating computer vision models, like PlantGuard AI which detects plant diseases.",
    } as Record<string, string>,
    tarifOpts: [
      { id: "palier_1", label: "Under 300,000 FCFA" }, { id: "palier_2", label: "300,000 – 600,000 FCFA" },
      { id: "palier_3", label: "600,000 – 1,800,000 FCFA" }, { id: "palier_4", label: "1,800,000 – 3,000,000 FCFA" },
      { id: "palier_5", label: "Over 3,000,000 FCFA" }, { id: "a_discuter", label: "To be discussed" },
    ] as Opt[],
    tarif: {
      palier_1: "For a small, simple project or a need still to be defined.",
      palier_2: "For a modest-sized project.",
      palier_3: "For a medium-sized project with several features.",
      palier_4: "For an ambitious project or a more complete application.",
      palier_5: "For a large custom project.",
      a_discuter: "No problem: describe your idea to Aaron and he'll suggest a suitable budget.",
    } as Record<string, string>,
    delaiOpts: [
      { id: "urgent_2sem", label: "Urgent (under 2 weeks)" }, { id: "1mois", label: "About 1 month" },
      { id: "2_3mois", label: "2 to 3 months" }, { id: "plus_3mois", label: "More than 3 months" }, { id: "flexible", label: "I'm flexible" },
    ] as Opt[],
    delai: {
      urgent_2sem: "Possible depending on Aaron's availability: to confirm directly with him.",
      "1mois": "A realistic timeline for a well-defined project, depending on its size.",
      "2_3mois": "Comfortable for a more complete project.",
      plus_3mois: "Suited to big projects, with deliveries in stages.",
      flexible: "Perfect: Aaron will suggest a schedule that fits your pace.",
    } as Record<string, string>,
    briefTypes: [
      { id: "web", label: "Website" }, { id: "app", label: "Web application" }, { id: "mobile", label: "Mobile application" },
      { id: "api", label: "API / Back-end" }, { id: "ia", label: "AI / Vision" }, { id: "autre", label: "Another idea" },
    ] as Opt[],
    briefType: "Great! What are we building?", briefBudget: "What budget do you have in mind? A rough estimate is fine.",
    briefDelai: "And by when?", briefName: "What's your name?", briefEmail: "Your email, so Aaron can reply?",
    briefMsg: "Describe your project in a few sentences.",
    badName: "I need your name (2 letters minimum).", badEmail: "That email doesn't look valid, can you check?",
    badMsg: "A bit more detail please (10 characters minimum).",
    confirmOpts: [{ id: "send", label: "Send to Aaron" }, { id: "cancel", label: "Cancel" }] as Opt[],
    confirmQ: "Shall I send it to Aaron?",
    sentOk: "Sent! Aaron will reply by email within 24h.",
    sentErr: "I couldn't send it. You can message Aaron directly on WhatsApp 👇",
    cancelled: "No problem, cancelled.", cancelBtn: "Cancel the brief",
    recap: { type: "Project", budget: "Budget", delai: "Timeline", name: "Name", email: "Email", message: "Message" },
    ph: { name: "Your name…", email: "you@email.com", message: "Describe your project…" },
    projTitle: "Open the site", projCode: "View the code",
  },
};

// À garder en phase avec la liste de src/pages/Projects.tsx
const CHAT_PROJECTS = [
  { title: "PlantGuard AI", fr: "Application mobile IA", en: "AI mobile application", live: false, tags: ["React Native", "FastAPI", "TensorFlow"], url: "", git: "https://github.com/AaronKAME200308/Aa.git" },
  { title: "Infinite Luxury Trips", fr: "Site de voyage", en: "Travel website", live: true, tags: ["React JS", "Tailwind CSS", "Supabase"], url: "https://infiniteluxurytrips.net", git: "" },
  { title: "JP Graphic Design", fr: "Site vitrine freelance", en: "Freelance showcase website", live: true, tags: ["React JS", "Tailwind CSS", "Supabase"], url: "https://jpgraphicdesign.net", git: "" },
  { title: "Yapithe & Partners", fr: "Site vitrine entreprise", en: "Business showcase website", live: true, tags: ["React JS", "Tailwind CSS", "Node.js"], url: "https://yapithepartners.com/", git: "" },
  { title: "MenuQR", fr: "Menu digital par QR code", en: "QR-code digital menu", live: false, tags: ["React JS", "Node.js", "Supabase"], url: "https://menu-qr-gules.vercel.app/", git: "" },
];

// Mêmes correspondances que le formulaire de contact
const TYPE_MAP: Record<string, string> = {
  web: "site_vitrine", app: "application_web", mobile: "application_mobile", api: "application_web", ia: "autre", autre: "autre",
};

const read = (): Shown[] => {
  try {
    const raw = JSON.parse(sessionStorage.getItem(KEY) ?? "[]") as Shown[];
    return raw.map((m) => (m.ui || m.actions ? m : parse(m)));
  } catch { return []; }
};
const readFlow = (): Flow => {
  try { return JSON.parse(sessionStorage.getItem(KEY + "-flow") ?? "null"); } catch { return null; }
};

const parse = (m: Msg): Shown => {
  const actions = [...m.content.matchAll(/\[\[(WA|FORM)\]\]/g)].map((x) => x[1] as "WA" | "FORM");
  return { ...m, content: m.content.replace(/\s*\[\[(WA|FORM)\]\]/g, "").trim(), actions };
};

/* ── Petits messages proactifs : discrets (3 max par visite, 45 s d'écart, stop dès que le visiteur ouvre le chat) ── */
type NudgeTopic = "arrive" | "idle" | "projects" | "skills" | "about" | "contact";
type NudgeSt = { n: number; last: number; stop: boolean; seen: string[] };
const NUDGE_KEY = "aun-nudge-st";
const NUDGE_MAX = 3, NUDGE_GAP = 45_000;
const readNudge = (): NudgeSt => {
  try { return { n: 0, last: 0, stop: false, seen: [], ...JSON.parse(sessionStorage.getItem(NUDGE_KEY) ?? "{}") }; }
  catch { return { n: 0, last: 0, stop: false, seen: [] }; }
};
const writeNudge = (st: NudgeSt) => { try { sessionStorage.setItem(NUDGE_KEY, JSON.stringify(st)); } catch { /* ignore */ } };
const soundOn = () => { try { return localStorage.getItem("aun-chat-sound") !== "0"; } catch { return true; } };

/** Petit « plop » discret ; ignoré si le navigateur n'autorise pas encore le son */
function blip() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const c = new AC();
    if (c.state === "suspended") { void c.close(); return; }
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(740, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(1180, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.28);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 0.3);
    o.onended = () => void c.close();
  } catch { /* ignore */ }
}

export default function ChatWidget() {
  const { lang } = useLang();
  const T = TXT[lang];
  const L = L2[lang];
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Shown[]>(() => read());
  const [flow, setFlow] = useState<Flow>(() => readFlow());
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [talk, setTalk] = useState(false);
  const [nudge, setNudge] = useState<{ text: string; topic: NudgeTopic } | null>(null);
  const [sound, setSound] = useState(soundOn);
  const [wave, setWave] = useState(false);
  // mobile : mascotte plus petite pour ne pas gêner la page
  const [small, setSmall] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setSmall(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const end = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(T.waMsg)}`;
  const mood: Mood = busy ? "think" : talk ? "talk" : wave ? "wave" : "idle";
  const textStep = flow && (flow.step === "name" || flow.step === "email" || flow.step === "message") ? flow.step : null;

  const tRef = useRef(T);
  const openRef = useRef(open);
  useEffect(() => { tRef.current = T; openRef.current = open; });
  const timers = useRef<number[]>([]);

  /** Renvoie le délai à attendre (ms) si seul l'écart minimum a bloqué le message */
  const fire = useCallback((topic: NudgeTopic): number | void => {
    if (openRef.current) return;
    const st = readNudge(), now = Date.now();
    if (st.stop || st.n >= NUDGE_MAX) return;
    if (topic !== "idle" && st.seen.includes(topic)) return;
    if (now - st.last < NUDGE_GAP) return NUDGE_GAP - (now - st.last);
    const N = tRef.current.nudges;
    const v = N[topic];
    const text = Array.isArray(v) ? v[st.n % v.length] : v;
    writeNudge({ ...st, n: st.n + 1, last: now, seen: topic === "idle" ? st.seen : [...st.seen, topic] });
    timers.current.forEach((t) => window.clearTimeout(t));
    setNudge({ text, topic }); setWave(true);
    if (soundOn()) blip();
    timers.current = [window.setTimeout(() => setWave(false), 2400), window.setTimeout(() => setNudge(null), 9000)];
  }, []);

  // salut à l'arrivée
  useEffect(() => {
    const t = window.setTimeout(() => fire("arrive"), 6000);
    return () => window.clearTimeout(t);
  }, [fire]);

  // rappel après 30 s sans activité
  useEffect(() => {
    let t = 0;
    const arm = () => { window.clearTimeout(t); t = window.setTimeout(() => { fire("idle"); arm(); }, 30_000); };
    const evs = ["pointermove", "scroll", "keydown", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();
    return () => { window.clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, arm)); };
  }, [fire]);

  // message selon la section regardée (après 3,5 s dans la section)
  useEffect(() => {
    const dwell = new Map<string, number>();
    // si l'écart minimum bloque, on réessaie juste après (tant que le visiteur est encore dans la section)
    const tryFire = (id: NudgeTopic) => {
      const wait = fire(id);
      if (typeof wait === "number") dwell.set(id, window.setTimeout(() => tryFire(id), wait + 300));
    };
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        const id = en.target.id as NudgeTopic;
        window.clearTimeout(dwell.get(id));
        if (en.isIntersecting) dwell.set(id, window.setTimeout(() => tryFire(id), 3500));
      }
    }, { rootMargin: "-40% 0px -40% 0px" });
    const seen = new Set<string>();
    const watch = () => (["projects", "skills", "about", "contact"] as const).forEach((id) => {
      const el = document.getElementById(id);
      if (el && !seen.has(id)) { seen.add(id); io.observe(el); }
    });
    watch();
    const retry = window.setTimeout(watch, 2000);
    return () => { window.clearTimeout(retry); dwell.forEach((t) => window.clearTimeout(t)); io.disconnect(); };
  }, [fire]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const toggleSound = () => {
    const v = !sound;
    setSound(v);
    try { localStorage.setItem("aun-chat-sound", v ? "1" : "0"); } catch { /* ignore */ }
    if (v) blip();
  };
  const dismissNudge = () => { setNudge(null); writeNudge({ ...readNudge(), stop: true }); };

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(msgs.filter((m) => !m.error)));
      sessionStorage.setItem(KEY + "-flow", JSON.stringify(flow));
    } catch { /* ignore */ }
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, flow, busy, open]);

  useEffect(() => {
    if (!open) return;
    setNudge(null);
    writeNudge({ ...readNudge(), stop: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => { window.removeEventListener("keydown", onKey); window.clearTimeout(t); };
  }, [open]);

  /* ── Menus : le texte des boutons dépend de la langue, l'état ne stocke que l'identifiant ── */
  const menuOpts = (id: MenuId): Opt[] => {
    switch (id) {
      case "start": return L.start;
      case "services": return L.svcOpts;
      case "tarifs": return L.tarifOpts;
      case "delais": return L.delaiOpts;
      case "brief_type": return L.briefTypes;
      case "brief_budget": return L.tarifOpts;
      case "brief_delai": return L.delaiOpts;
      case "brief_confirm": return L.confirmOpts;
    }
  };

  const bot = (content: string, ui?: Ui): Shown => ({ role: "assistant", content, ui });
  const menuMsg = (text: string, id: MenuId) => bot(text, { t: "menu", id });

  const labelOf = (list: Opt[], id?: string) => list.find((o) => o.id === id)?.label ?? id ?? "—";

  /** Un clic sur la bulle ouvre le chat, avec le bon sujet si la conversation est vide */
  const openFromNudge = (topic: NudgeTopic) => {
    setOpen(true);
    const target = ({ projects: "projets", skills: "services", contact: "brief" } as Partial<Record<NudgeTopic, string>>)[topic];
    const opt = target && L.start.find((o) => o.id === target);
    if (opt && msgs.length === 0 && !flow) window.setTimeout(() => pick("start", opt), 350);
  };

  const pick = (menu: MenuId, opt: Opt) => {
    if (busy) return;
    const me: Shown = { role: "user", content: opt.label };
    const more = menuMsg(L.more, "start");
    switch (menu) {
      case "start":
        if (opt.id === "services") setMsgs((m) => [...m, me, menuMsg(L.servicesIntro, "services")]);
        else if (opt.id === "tarifs") setMsgs((m) => [...m, me, menuMsg(L.tarifsIntro, "tarifs")]);
        else if (opt.id === "delais") setMsgs((m) => [...m, me, menuMsg(L.delaisIntro, "delais")]);
        else if (opt.id === "projets") setMsgs((m) => [...m, me, bot(L.projectsIntro, { t: "projects" }), more]);
        else if (opt.id === "brief") { setFlow({ step: "type", d: {} }); setMsgs((m) => [...m, me, menuMsg(L.briefType, "brief_type")]); }
        break;
      case "services":
        setMsgs((m) => [...m, me, bot(L.svc[opt.id]), more]);
        break;
      case "tarifs":
        setMsgs((m) => [...m, me, bot(`${L.tarif[opt.id]} ${L.tarifsNote}`), more]);
        break;
      case "delais":
        setMsgs((m) => [...m, me, bot(`${L.delai[opt.id]} ${L.delaisNote}`), more]);
        break;
      case "brief_type":
        setFlow({ step: "budget", d: { ...flow?.d, type: opt.id } });
        setMsgs((m) => [...m, me, menuMsg(L.briefBudget, "brief_budget")]);
        break;
      case "brief_budget":
        setFlow({ step: "delai", d: { ...flow?.d, budget: opt.id } });
        setMsgs((m) => [...m, me, menuMsg(L.briefDelai, "brief_delai")]);
        break;
      case "brief_delai":
        setFlow({ step: "name", d: { ...flow?.d, delai: opt.id } });
        setMsgs((m) => [...m, me, bot(L.briefName)]);
        break;
      case "brief_confirm":
        if (opt.id === "send") void submitBrief(me);
        else cancelFlow(me);
        break;
    }
  };

  const cancelFlow = (me?: Shown) => {
    setFlow(null);
    setMsgs((m) => [...m, ...(me ? [me] : []), bot(L.cancelled), menuMsg(L.more, "start")]);
  };

  const submitBrief = async (me: Shown) => {
    const d = flow?.d;
    if (!d) return;
    setMsgs((m) => [...m, me]);
    setBusy(true);
    // Le brief est enregistré en français (lisible dans /admin), quelle que soit la langue du visiteur
    const fr = L2.fr;
    const typeFr = labelOf(fr.briefTypes, d.type), budgetFr = labelOf(fr.tarifOpts, d.budget), delaiFr = labelOf(fr.delaiOpts, d.delai);
    const description = [
      "[Envoyé via le chat]",
      `Type de projet : ${typeFr}`, `Budget : ${budgetFr}`, `Délai : ${delaiFr}`,
      lang === "en" ? "Langue du visiteur : anglais" : "",
      "Message :", d.message ?? "",
    ].filter(Boolean).join("\n");
    try {
      const { error } = await supabase.rpc("submit_contact", {
        p: {
          client_name: d.name, client_email: d.email, project_type: TYPE_MAP[d.type ?? "autre"],
          project_title: `Contact : ${typeFr} (chat)`, description,
          budget_range: d.budget, budget_currency: "XAF", deadline: d.delai, website: "",
        },
      });
      if (error) throw error;
      setFlow(null);
      setMsgs((m) => [...m, { ...bot(L.sentOk), sent: true }, menuMsg(L.more, "start")]);
    } catch {
      setMsgs((m) => [...m, { ...bot(L.sentErr), actions: ["WA"], error: true }]);
    } finally { setBusy(false); }
  };

  /* Réponse libre pendant le brief guidé (nom, email, message) */
  const flowText = (text: string) => {
    const value = text.trim();
    if (!flow || !textStep || !value) return;
    const me: Shown = { role: "user", content: value };
    setInput("");
    if (textStep === "name") {
      if (value.length < 2) { setMsgs((m) => [...m, me, bot(L.badName)]); return; }
      setFlow({ step: "email", d: { ...flow.d, name: value.slice(0, 120) } });
      setMsgs((m) => [...m, me, bot(L.briefEmail)]);
    } else if (textStep === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setMsgs((m) => [...m, me, bot(L.badEmail)]); return; }
      setFlow({ step: "message", d: { ...flow.d, email: value.slice(0, 200) } });
      setMsgs((m) => [...m, me, bot(L.briefMsg)]);
    } else {
      if (value.length < 10) { setMsgs((m) => [...m, me, bot(L.badMsg)]); return; }
      const d = { ...flow.d, message: value.slice(0, 600) };
      setFlow({ step: "confirm", d });
      const r = L.recap;
      const recap = [
        `${r.type} : ${labelOf(L.briefTypes, d.type)}`, `${r.budget} : ${labelOf(L.tarifOpts, d.budget)}`,
        `${r.delai} : ${labelOf(L.delaiOpts, d.delai)}`, `${r.name} : ${d.name}`, `${r.email} : ${d.email}`, `${r.message} : ${d.message}`,
      ].join("\n");
      setMsgs((m) => [...m, me, bot(`${recap}\n\n${L.confirmQ}`, { t: "menu", id: "brief_confirm" })]);
    }
  };

  /* Texte libre : l'IA répond */
  const send = useCallback(async (text: string) => {
    const content = text.trim().slice(0, 600);
    if (!content || busy) return;
    const next: Shown[] = [...msgs.filter((m) => !m.error), { role: "user", content }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const history = next.filter((m) => m.content).map((m) => ({ role: m.role, content: m.content }));
      const { data, error } = await supabase.functions.invoke("aun-chat", { body: { messages: history, lang } });
      if (error || !data?.reply) {
        const limited = (error as { context?: { status?: number } } | null)?.context?.status === 429;
        setMsgs([...next, { role: "assistant", content: limited ? T.errLimit : T.errGeneric, actions: ["WA"], error: true }]);
      } else {
        setMsgs([...next, { ...parse({ role: "assistant", content: data.reply }), sent: !!data.sent }]);
        setTalk(true); window.setTimeout(() => setTalk(false), Math.min(4000, 900 + data.reply.length * 25));
      }
    } catch {
      setMsgs([...next, { role: "assistant", content: T.errGeneric, actions: ["WA"], error: true }]);
    } finally { setBusy(false); }
  }, [busy, msgs, lang, T]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textStep) flowText(input); else void send(input);
  };

  const goForm = () => {
    setOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const keyWa = "[--key-face:#25D366] [--key-edge:#0f7a3b] [--key-text:#fff]";
  const keyGreen = "[--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]";
  const chip = "font-body text-[13px] rounded-sm border-2 border-aun/40 bg-white px-3 py-1.5 text-forest hover:bg-sage transition disabled:opacity-45 disabled:hover:bg-white disabled:cursor-default";

  const Menu = ({ id, active }: { id: MenuId; active: boolean }) => (
    <div className="flex flex-wrap gap-2 pl-1">
      {menuOpts(id).map((o) => (
        <button key={o.id} disabled={!active || busy} onClick={() => pick(id, o)} className={chip}>{o.label}</button>
      ))}
    </div>
  );

  const placeholder = textStep ? L.ph[textStep] : T.placeholder;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog" aria-label={T.open}
            initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100dvh-7.5rem)] rounded-sm bg-cream border-2 border-forest/15 shadow-[0_24px_60px_-12px_rgba(14,47,32,0.45)] overflow-hidden"
          >
            <header className="flex items-center gap-3 bg-forest text-cream px-4 py-3">
              <span className="grid place-items-center h-11 w-11 rounded-sm bg-cream/10 shrink-0"><Mascot size={36} mood={mood} /></span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-extrabold leading-tight">{T.name}</p>
                <p className="text-xs text-moss truncate">{T.sub}</p>
              </div>
              <button onClick={toggleSound} aria-label={sound ? T.soundOff : T.sound} aria-pressed={sound} title={sound ? T.soundOff : T.sound}
                className="p-2 rounded-sm hover:bg-cream/10">{sound ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
              <button onClick={() => setOpen(false)} aria-label={T.close} className="p-2 rounded-sm hover:bg-cream/10"><X size={18} /></button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
              <Bubble role="assistant">{T.hello}</Bubble>
              {msgs.length === 0 && <Menu id="start" active />}
              {msgs.map((m, i) => {
                const last = i === msgs.length - 1;
                return (
                  <div key={i} className="space-y-2">
                    {m.content && <Bubble role={m.role}>{m.content}</Bubble>}
                    {m.ui?.t === "projects" && (
                      <div className="space-y-2 pl-1">
                        {CHAT_PROJECTS.map((p) => {
                          const href = p.url || p.git;
                          return (
                            <a key={p.title} href={href} target="_blank" rel="noopener noreferrer"
                              className="block rounded-sm border-2 border-ink/10 bg-white p-3 transition hover:border-aun hover:bg-sage/40">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="m-0 font-display font-bold text-forest text-sm leading-tight">{p.title}</p>
                                  <p className="m-0 text-xs text-ink-mute">{p[lang]}</p>
                                </div>
                                <span className={`shrink-0 rounded-sm px-2 py-0.5 font-mono-label !text-[9px] ${p.live ? "bg-aun/15 text-aun" : "bg-amber-100 text-amber-700"}`}>
                                  {p.live ? (lang === "en" ? "Live" : "En ligne") : (lang === "en" ? "In progress" : "En cours")}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {p.tags.map((t) => <span key={t} className="rounded-sm bg-sage px-1.5 py-0.5 font-mono text-[10px] text-forest">{t}</span>)}
                              </div>
                              <p className="m-0 mt-2 flex items-center gap-1 text-xs font-semibold text-aun">
                                {p.url ? L.projTitle : L.projCode} <ExternalLink size={12} />
                              </p>
                            </a>
                          );
                        })}
                      </div>
                    )}
                    {m.ui?.t === "menu" && <Menu id={m.ui.id} active={last} />}
                    {m.sent && <p className="text-xs text-aun font-semibold pl-1">✓ {T.sent}</p>}
                    {m.actions && m.actions.length > 0 && (
                      <div className="flex flex-wrap gap-3 pl-1 pt-1">
                        {m.actions.includes("WA") && (
                          <a href={waUrl} target="_blank" rel="noopener noreferrer" className={`keycap !rounded-sm px-4 py-2 text-[13px] font-semibold ${keyWa}`}>
                            <FaWhatsapp size={15} /> {T.wa}
                          </a>
                        )}
                        {m.actions.includes("FORM") && (
                          <button onClick={goForm} className={`keycap !rounded-sm px-4 py-2 text-[13px] font-semibold ${keyGreen}`}>{T.form}</button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {busy && (
                <div className="flex gap-1 pl-3 pt-1" aria-label="…">
                  {[0, 1, 2].map((d) => (
                    <motion.i key={d} className="h-2 w-2 rounded-sm bg-aun" animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />
                  ))}
                </div>
              )}
              <div ref={end} />
            </div>

            {flow && (
              <div className="bg-white/60 px-4 pt-2">
                <button type="button" onClick={() => cancelFlow()} className="text-xs font-semibold text-ink-mute underline underline-offset-2 hover:text-aun">
                  {L.cancelBtn}
                </button>
              </div>
            )}
            <form onSubmit={onSubmit}
              className="flex items-center gap-3 border-t-2 border-dashed border-forest/15 bg-white/60 px-4 py-3">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={600}
                type={textStep === "email" ? "email" : "text"}
                placeholder={placeholder} aria-label={placeholder}
                className="flex-1 min-w-0 rounded-sm border-2 border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-aun focus:ring-4 focus:ring-aun/15" />
              <button type="submit" disabled={busy || !input.trim()} aria-label={T.send}
                className={`keycap !rounded-sm h-10 w-10 shrink-0 disabled:opacity-50 ${keyGreen}`}><Send size={16} /></button>
            </form>
            <p className="m-0 px-4 pb-2 bg-white/60 text-[11px] leading-snug text-ink-mute">
              {T.privacy}{" "}
              <a href="/confidentialite" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-aun">{T.privacyLink}</a>
            </p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-forest/5 py-2 text-xs font-semibold text-forest hover:bg-forest/10 transition">
              <FaWhatsapp size={14} /> {T.wa}
            </a>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {nudge && !open && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="absolute right-[62px] sm:right-[84px] top-1/2 -translate-y-1/2 w-max max-w-[210px] sm:max-w-[300px] flex items-start rounded-sm bg-white shadow-lg border-2 border-forest/10">
              <button onClick={() => openFromNudge(nudge.topic)}
                className="text-left whitespace-normal pl-3 pr-1 py-2 sm:pl-4 sm:py-2.5 text-[13px] sm:text-sm font-semibold text-forest">
                {nudge.text}
              </button>
              <button onClick={dismissNudge} aria-label={T.close} className="p-1.5 mt-0.5 text-ink-mute hover:text-forest shrink-0"><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setOpen((o) => !o)} aria-label={open ? T.close : T.open} aria-expanded={open}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.8 }}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
          className="grid place-items-center h-[50px] w-[50px] sm:h-[72px] sm:w-[72px] rounded-full bg-cream border-2 border-forest/15 shadow-[0_10px_28px_-6px_rgba(14,47,32,0.5)]"
        >
          <Mascot size={small ? 36 : 52} mood={mood} look={!open} />
        </motion.button>
      </div>
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const me = role === "user";
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <p className={`m-0 max-w-[86%] whitespace-pre-line rounded-sm px-3.5 py-2.5 text-sm leading-relaxed ${
        me ? "bg-forest text-cream" : "bg-white text-ink border-2 border-ink/10"}`}>
        {children}
      </p>
    </div>
  );
}