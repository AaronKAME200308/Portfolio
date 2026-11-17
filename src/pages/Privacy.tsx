import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLang } from "../lib/i18n";
import LangSwitch from "../components/LangSwitch";

const UPDATED = { fr: "17 novembre 2026", en: "November 17, 2026" };
const EMAIL = "aaronmouele11pro@gmail.com";

type Block = { h: string; p?: string[]; ul?: string[] };

const TXT: Record<"fr" | "en", {
  back: string; kicker: string; title: string; updated: string; intro: string; sections: Block[]; contactLine: string;
}> = {
  fr: {
    back: "Retour au site", kicker: "Légal", title: "Politique de confidentialité",
    updated: "Dernière mise à jour",
    intro:
      "Cette page explique, simplement, quelles données personnelles ce site collecte, pourquoi, avec qui elles sont partagées, combien de temps elles sont gardées et comment exercer vos droits. Elle s'applique au portfolio, au formulaire de contact, au chatbot « Aun » et à l'espace de suivi de commande.",
    sections: [
      {
        h: "Qui est responsable de vos données ?",
        p: [
          "Aaron KAME MOUELE, développeur web et mobile freelance, basé à Yaoundé (Cameroun).",
          `Pour toute question sur vos données : ${EMAIL}.`,
        ],
      },
      {
        h: "Quelles données, et pourquoi ?",
        ul: [
          "Formulaire de contact : nom, email, et selon ce que vous remplissez, téléphone, entreprise, type de projet, budget, délai et description. Utilisés pour répondre à votre demande et préparer un devis.",
          "Chatbot : les messages que vous écrivez, et, si vous acceptez que le chatbot transmette votre demande, votre nom, votre email et la description du projet. Utilisés pour répondre à vos questions et enregistrer votre demande.",
          "Espace de suivi de commande (lien personnel) : informations sur votre projet, statut, et l'avis que vous choisissez de laisser. Utilisés pour réaliser et suivre le projet.",
          "Avis clients : note, commentaire et nom. Ils ne sont publiés sur le site qu'après votre accord et ma validation.",
          "Facturation : nom, email, montants et références de paiement. Utilisés pour émettre les factures et respecter les obligations comptables.",
          "Statistiques de visites : un identifiant aléatoire, la page visitée, la langue, le type d'appareil (mobile ou ordinateur) et le site d'origine. Je ne stocke ni votre adresse IP ni votre nom, et je n'utilise aucun cookie publicitaire. Ces données servent uniquement à comprendre combien de personnes visitent le site.",
          "Mesure d'audience Vercel : statistiques anonymes de pages vues, fournies par l'hébergeur, sans cookie de suivi.",
          "Protection contre les abus : pour limiter l'usage du chatbot, une empreinte irréversible de votre adresse IP est conservée 7 jours au maximum. Elle ne permet pas de vous identifier.",
        ],
      },
      {
        h: "Fondements juridiques",
        p: [
          "Je traite vos données (1) pour répondre à votre demande et exécuter un contrat ou des démarches précontractuelles, (2) avec votre consentement lorsque vous envoyez un formulaire ou un message au chatbot, vous pouvez le retirer à tout moment, (3) pour respecter mes obligations légales, notamment comptables, et (4) pour mon intérêt légitime à connaître l'audience du site et à le protéger contre les abus.",
        ],
      },
      {
        h: "Cookies et stockage dans votre navigateur",
        p: [
          "Le site n'utilise ni cookie publicitaire ni outil de pistage. Il enregistre seulement, dans votre navigateur :",
        ],
        ul: [
          "votre choix de langue (FR/EN) ;",
          "un identifiant aléatoire pour ne compter qu'une seule visite par personne ;",
          "la conversation en cours avec le chatbot, supprimée à la fermeture de l'onglet.",
        ],
      },
      {
        h: "Chatbot et intelligence artificielle",
        p: [
          "Le chatbot « Aun » est un assistant automatique. Vos messages sont envoyés à un service d'IA tiers (Google Gemini) pour produire les réponses. Selon les conditions de Google pour l'offre gratuite, ces échanges peuvent être utilisés pour améliorer ses produits.",
          "N'écrivez donc pas d'informations sensibles (mots de passe, données bancaires, santé, etc.). Les réponses du chatbot peuvent contenir des erreurs : un devis ou un engagement n'est valable que s'il vient directement de moi. Aucune décision vous concernant n'est prise automatiquement.",
        ],
      },
      {
        h: "Avec qui vos données sont-elles partagées ?",
        p: ["Je ne vends jamais vos données. Je fais appel à des prestataires techniques qui les traitent pour mon compte :"],
        ul: [
          "Supabase : base de données et fonctions du site ;",
          "Vercel : hébergement du site et mesure d'audience anonyme ;",
          "Resend : envoi des emails de notification ;",
          "Google : service d'IA du chatbot (Gemini) et polices de caractères (Google Fonts) ;",
          "WhatsApp (Meta) : uniquement si vous cliquez sur le bouton pour m'écrire, vos échanges sont alors soumis à leurs règles.",
        ],
      },
      {
        h: "Transferts hors du Cameroun",
        p: [
          "Ces prestataires peuvent stocker ou traiter des données dans d'autres pays, notamment en Europe et aux États-Unis. Je choisis des services qui proposent des garanties contractuelles de protection. En utilisant le formulaire ou le chatbot, vous acceptez ces transferts nécessaires au fonctionnement du service.",
        ],
      },
      {
        h: "Combien de temps sont-elles gardées ?",
        ul: [
          "Demandes de contact sans suite : 3 ans après le dernier échange, puis suppression.",
          "Clients et commandes : la durée du projet, puis 3 ans après le dernier contact.",
          "Factures : la durée légale de conservation des documents comptables.",
          "Avis publiés : tant que vous ne demandez pas leur retrait.",
          "Statistiques de visites : anonymes, 24 mois au maximum.",
          "Conversation du chatbot : le temps de votre visite dans votre navigateur ; seule la demande que vous avez choisi d'envoyer est enregistrée chez moi.",
        ],
      },
      {
        h: "Vos droits",
        p: [
          "Vous pouvez à tout moment demander : l'accès à vos données, leur rectification, leur effacement, la limitation de leur traitement, votre opposition à leur usage (notamment pour la prospection), leur portabilité, et retirer votre consentement.",
          `Écrivez-moi à ${EMAIL}. Je réponds dans un délai d'un mois. Une pièce permettant de vérifier votre identité peut vous être demandée.`,
          "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l'autorité camerounaise de protection des données personnelles, ou l'autorité de protection des données de votre pays de résidence (par exemple, pour l'Union européenne, celle de votre État membre).",
        ],
      },
      {
        h: "Sécurité",
        p: [
          "Le site est servi en HTTPS. L'accès aux données est limité : l'espace d'administration demande une connexion, les liens de suivi de commande sont uniques et non devinables, et la base de données est protégée par des règles d'accès. Aucun système n'est infaillible, mais je limite les données collectées au strict nécessaire.",
        ],
      },
      {
        h: "Mineurs",
        p: ["Ce site s'adresse à un public professionnel et adulte. Si un mineur m'a transmis des données, écrivez-moi pour les faire supprimer."],
      },
      {
        h: "Modifications",
        p: ["Cette politique peut évoluer, par exemple si j'ajoute un nouvel outil. La date de mise à jour en haut de page indique la version en vigueur."],
      },
    ],
    contactLine: "Une question sur vos données ?",
  },
  en: {
    back: "Back to the site", kicker: "Legal", title: "Privacy policy",
    updated: "Last updated",
    intro:
      "This page explains, in plain words, what personal data this site collects, why, who it is shared with, how long it is kept and how to exercise your rights. It covers the portfolio, the contact form, the “Aun” chatbot and the order tracking space.",
    sections: [
      {
        h: "Who is responsible for your data?",
        p: [
          "Aaron KAME MOUELE, freelance web and mobile developer, based in Yaoundé (Cameroon).",
          `For any question about your data: ${EMAIL}.`,
        ],
      },
      {
        h: "What data, and why?",
        ul: [
          "Contact form: name, email and, depending on what you fill in, phone, company, project type, budget, deadline and description. Used to answer your request and prepare a quote.",
          "Chatbot: the messages you write and, if you agree that the chatbot forwards your request, your name, email and project description. Used to answer your questions and record your request.",
          "Order tracking space (personal link): project information, status, and the review you choose to leave. Used to carry out and follow the project.",
          "Customer reviews: rating, comment and name. They are published only with your agreement and after my validation.",
          "Invoicing: name, email, amounts and payment references. Used to issue invoices and meet accounting obligations.",
          "Visit statistics: a random identifier, the page visited, language, device type (mobile or desktop) and referring site. I store neither your IP address nor your name, and I use no advertising cookies. This only helps me understand how many people visit the site.",
          "Vercel audience measurement: anonymous page-view statistics provided by the host, with no tracking cookie.",
          "Abuse protection: to limit chatbot use, an irreversible fingerprint of your IP address is kept for 7 days at most. It cannot identify you.",
        ],
      },
      {
        h: "Legal bases",
        p: [
          "I process your data (1) to answer your request and perform a contract or pre-contract steps, (2) with your consent when you submit a form or a chatbot message, which you can withdraw at any time, (3) to meet legal obligations, notably accounting ones, and (4) for my legitimate interest in knowing the site's audience and protecting it against abuse.",
        ],
      },
      {
        h: "Cookies and browser storage",
        p: ["The site uses no advertising cookies or tracking tools. It only saves in your browser:"],
        ul: [
          "your language choice (FR/EN);",
          "a random identifier so that each person is counted only once;",
          "the current chatbot conversation, deleted when you close the tab.",
        ],
      },
      {
        h: "Chatbot and artificial intelligence",
        p: [
          "The “Aun” chatbot is an automatic assistant. Your messages are sent to a third-party AI service (Google Gemini) to generate answers. Under Google's terms for the free tier, these exchanges may be used to improve its products.",
          "So please do not write sensitive information (passwords, bank details, health data, etc.). The chatbot can make mistakes: a quote or commitment is only valid if it comes directly from me. No decision about you is made automatically.",
        ],
      },
      {
        h: "Who is your data shared with?",
        p: ["I never sell your data. I use technical providers who process it on my behalf:"],
        ul: [
          "Supabase: database and site functions;",
          "Vercel: site hosting and anonymous audience measurement;",
          "Resend: sending notification emails;",
          "Google: the chatbot's AI service (Gemini) and fonts (Google Fonts);",
          "WhatsApp (Meta): only if you click the button to message me, your exchanges are then subject to their rules.",
        ],
      },
      {
        h: "Transfers outside Cameroon",
        p: [
          "These providers may store or process data in other countries, notably in Europe and the United States. I choose services that offer contractual data protection safeguards. By using the form or the chatbot, you accept these transfers needed to run the service.",
        ],
      },
      {
        h: "How long is it kept?",
        ul: [
          "Contact requests with no follow-up: 3 years after the last exchange, then deleted.",
          "Clients and orders: the duration of the project, then 3 years after the last contact.",
          "Invoices: the legal retention period for accounting documents.",
          "Published reviews: until you ask for their removal.",
          "Visit statistics: anonymous, 24 months at most.",
          "Chatbot conversation: only for your visit, in your browser; only the request you choose to send is stored on my side.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "At any time you can request: access to your data, its correction, its deletion, restriction of its processing, to object to its use (notably for marketing), its portability, and withdraw your consent.",
          `Write to ${EMAIL}. I answer within one month. I may ask for proof of identity.`,
          "If you believe your rights are not respected, you can contact the Cameroonian personal data protection authority, or the data protection authority of your country of residence (for example, in the European Union, that of your Member State).",
        ],
      },
      {
        h: "Security",
        p: [
          "The site is served over HTTPS. Access to data is limited: the admin area requires a login, order tracking links are unique and unguessable, and the database is protected by access rules. No system is flawless, but I keep data collection to the strict minimum.",
        ],
      },
      {
        h: "Minors",
        p: ["This site is aimed at a professional, adult audience. If a minor has sent me data, write to me and I will delete it."],
      },
      {
        h: "Changes",
        p: ["This policy may change, for example if I add a new tool. The update date at the top of the page shows the current version."],
      },
    ],
    contactLine: "A question about your data?",
  },
};

export default function Privacy() {
  const { lang } = useLang();
  const T = TXT[lang];

  useEffect(() => { window.scrollTo(0, 0); document.title = `${T.title} · Aun`; }, [T.title]);

  return (
    <div className="font-body bg-cream text-ink min-h-screen">
      <header className="bg-forest text-cream">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-moss transition">
            <ArrowLeft size={16} /> {T.back}
          </Link>
          <LangSwitch dark />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <p className="font-mono-label text-aun">{T.kicker}</p>
        <h1 className="font-display font-extrabold text-forest mt-2 mb-3" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.05 }}>
          {T.title}
        </h1>
        <p className="font-mono-label !text-[11px] text-ink-mute mb-8">{T.updated} : {UPDATED[lang]}</p>
        <p className="text-base leading-relaxed text-ink-soft mb-10">{T.intro}</p>

        <div className="space-y-9">
          {T.sections.map((s, i) => (
            <section key={s.h} aria-labelledby={`p${i}`}>
              <h2 id={`p${i}`} className="font-display font-bold text-xl text-forest mb-3 flex gap-3">
                <span className="font-mono-label !text-[12px] text-aun pt-1.5">{String(i + 1).padStart(2, "0")}</span>
                {s.h}
              </h2>
              <div className="pl-0 sm:pl-9 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                {s.p?.map((t, k) => <p key={k} className="m-0">{t}</p>)}
                {s.ul && (
                  <ul className="m-0 pl-5 space-y-2 list-disc marker:text-aun">
                    {s.ul.map((t, k) => <li key={k}>{t}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-sage/70 p-6 flex flex-wrap items-center justify-between gap-4">
          <p className="m-0 font-semibold text-forest">{T.contactLine}</p>
          <a href={`mailto:${EMAIL}`} className="keycap px-5 py-3 text-sm font-semibold [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]">
            {EMAIL}
          </a>
        </div>
      </main>
    </div>
  );
}