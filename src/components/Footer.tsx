import { Github, Linkedin, Mail, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "../lib/i18n";

// Ton SVG du dossier public/ : change le nom si ton fichier s'appelle autrement
const LOGO_SRC = "/Aun/aun-symbole-vert.svg";

const EASE = [0.22, 1, 0.36, 1] as const;

const TXT = {
  fr: {
    links: [
      { id: "about", label: "À propos" },
      { id: "skills", label: "Compétences" },
      { id: "projects", label: "Projets" },
      { id: "contact", label: "Contact" },
    ],
    blurb: "Développeur freelance passionné par la création d'expériences web et mobile élégantes.",
    nav: "Navigation", contact: "Contact", place: "Yaoundé, Cameroun",
    ctaTitle: "Vous avez un projet ?",
    ctaText: "Disponible pour de nouvelles missions freelance. Démarrons la conversation.",
    cta: "Démarrons ensemble", rights: "Tous droits réservés.", privacy: "Politique de confidentialité",
  },
  en: {
    links: [
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "projects", label: "Projects" },
      { id: "contact", label: "Contact" },
    ],
    blurb: "Freelance developer passionate about building elegant web and mobile experiences.",
    nav: "Navigation", contact: "Contact", place: "Yaoundé, Cameroon",
    ctaTitle: "Got a project?",
    ctaText: "Available for new freelance work. Let's start the conversation.",
    cta: "Let's work together", rights: "All rights reserved.", privacy: "Privacy policy",
  },
};

const socials = [
  { icon: Github, href: "https://github.com/AaronKAME200308", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/aaron-kame-mouele-b82619289/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:aaronmouele11pro@gmail.com", label: "Email" },
];

const contactBase = [
  { icon: Mail, value: "aaronmouele11pro@gmail.com", href: "mailto:aaronmouele11pro@gmail.com" },
  { icon: Phone, value: "+237 670 464 488", href: "tel:+237670464488" },
  { icon: MapPin, value: "", href: null },
];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: EASE },
});

export default function Footer() {
  const { lang } = useLang();
  const T = TXT[lang];
  const navLinks = T.links;
  const contactItems = contactBase.map((c) => (c.icon === MapPin ? { ...c, value: T.place } : c));
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-cream pt-20 pb-9">
      {/* Grand symbole en filigrane */}
      <div className="absolute -bottom-24 -right-16 pointer-events-none opacity-[0.07]" aria-hidden="true">
        <img src={LOGO_SRC} alt="" className="w-[520px] h-[520px] object-contain block" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Marque */}
          <motion.div {...reveal(0)}>
            <span className="inline-flex items-center gap-2.5 mb-5">
              <img src={LOGO_SRC} alt="" className="h-9 w-9 object-contain block" />
              <span
                className="font-display font-semibold leading-none text-aun"
                style={{ fontSize: 34, letterSpacing: "-0.01em" }}
              >
                Aun
              </span>
            </span>
            <p className="text-sm leading-relaxed mb-6 text-ink-mute max-w-xs">
              {T.blurb}
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-forest border border-sage bg-white transition-colors hover:bg-aun hover:border-aun hover:text-white"
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div {...reveal(0.1)}>
            <p className="font-mono-label mb-5 text-aun">{T.nav}</p>
            <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="group flex items-center gap-2 text-sm bg-transparent border-0 cursor-pointer py-1 text-ink-soft hover:text-aun transition-colors text-left"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div {...reveal(0.2)}>
            <p className="font-mono-label mb-5 text-aun">{T.contact}</p>
            <div className="flex flex-col gap-3.5">
              {contactItems.map(({ icon: Icon, value, href }) => (
                <div key={value} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white border border-sage">
                    <Icon size={14} className="text-aun" />
                  </div>
                  {href ? (
                    <a href={href} className="text-sm text-ink-soft no-underline hover:text-aun transition-colors">
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm text-ink-soft">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Carte d'appel à l'action */}
          <motion.div
            {...reveal(0.3)}
            className="rounded-2xl p-6 bg-sage/60 border border-sage"
          >
            <p className="font-display font-semibold text-lg text-forest mb-2">{T.ctaTitle}</p>
            <p className="text-sm leading-relaxed mb-5 text-ink-mute">
              {T.ctaText}
            </p>
            <button
              onClick={() => scrollTo("contact")}
              className="keycap text-sm font-semibold px-5 py-3 [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
            >
              {T.cta}
            </button>
          </motion.div>
        </div>

        <div className="h-px mb-6 bg-sage" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs m-0 text-ink-mute">
            © {new Date().getFullYear()} Aaron KAME MOUELE · {T.rights}
          </p>
          <p className="text-xs m-0 text-ink-mute">
            <a href="/confidentialite" className="underline underline-offset-2 hover:text-aun">{T.privacy}</a> · {T.place}
          </p>
        </div>
      </div>
    </footer>
  );
}