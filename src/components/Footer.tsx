import { Code2, Heart, Github, Linkedin, Mail, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { id: "about",    label: "À propos"    },
  { id: "skills",   label: "Compétences" },
  { id: "projects", label: "Projets"     },
  { id: "contact",  label: "Contact"     },
];

const socials = [
  { icon: Github,   href: "https://github.com/AaronKAME200308",                       label: "GitHub"   },
  { icon: Linkedin, href: "https://www.linkedin.com/in/aaron-kame-mouele-b82619289/", label: "LinkedIn" },
  { icon: Mail,     href: "mailto:aaronmouele11@gmail.com",                           label: "Email"    },
];

const contactItems = [
  { icon: Mail,   value: "aaronmouele11@gmail.com", href: "mailto:aaronmouele11@gmail.com" },
  { icon: Phone,  value: "+237 670 464 488",        href: "tel:+237670464488"              },
  { icon: MapPin, value: "Yaoundé, Cameroun",       href: null                             },
];

export default function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(170deg, #0f0b1e 0%, #12112b 55%, #0c1628 100%)",
        paddingTop: 72,
        paddingBottom: 36,
      }}
    >
      {/* ── Background glows ── */}
      <div className="absolute pointer-events-none" style={{ top: -100, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none" style={{ bottom: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)" }} />

      {/* ── Dot grid decoration ── */}
      <svg className="absolute top-6 right-6 opacity-[0.06]" width="120" height="120">
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 5 }, (_, c) => (
            <circle key={`${r}-${c}`} cx={c * 22 + 11} cy={r * 22 + 11} r="2" fill="#a78bfa" />
          ))
        )}
      </svg>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── TOP GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                  boxShadow: "0 3px 16px rgba(124,58,237,0.5)",
                }}
              >
                <Code2 size={18} color="white" />
              </div>
              <div>
                <p className="font-bold text-base text-white m-0" style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>
                  Aaron KAME
                </p>
                <p className="text-xs m-0" style={{ color: "rgba(255,255,255,0.35)" }}>Full-Stack Developer</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.38)" }}>
              Développeur freelance passionné par la création d'expériences web et mobile élégantes.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.08 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(59,130,246,0.25))";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.28)" }}>
              Navigation
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="flex items-center gap-2 text-sm transition-colors duration-200 group"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.45)",
                      padding: "3px 0",
                      textAlign: "left",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"}
                  >
                    {l.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 group-hover:-translate-y-1"
                      style={{ transition: "all 0.2s ease" }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.28)" }}>
              Contact
            </p>
            <div className="flex flex-col gap-3.5">
              {contactItems.map(({ icon: Icon, value, href }) => (
                <div key={value} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon size={13} style={{ color: "rgba(167,139,250,0.85)" }} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="text-xs transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"}
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(59,130,246,0.12))",
              border: "1px solid rgba(124,58,237,0.28)",
            }}
          >
            {/* Top sheen */}
            <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px 16px 0 0" }} />

            <p className="font-bold text-base text-white mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>
              Vous avez un projet ?
            </p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
              Disponible pour de nouvelles missions freelance. Démarrons la conversation.
            </p>
            <motion.button
              onClick={() => scrollTo("contact")}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
              }}
            >
              Démarrons ensemble
            </motion.button>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <div
          className="mb-6"
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(124,58,237,0.18) 50%, rgba(255,255,255,0.08) 70%, transparent)",
          }}
        />

        {/* ── Bottom bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs m-0" style={{ color: "rgba(255,255,255,0.28)" }}>
            © {new Date().getFullYear()} Aaron KAME MOUELE — Tous droits réservés.
          </p>
          <p className="text-xs m-0 flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.28)" }}>
            Fait avec
            <Heart size={11} color="#f43f5e" fill="#f43f5e" />
            en React + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}