import { Code2, Heart, Github, Linkedin, Mail, ArrowUpRight, MapPin, Phone } from "lucide-react";

const navLinks = [
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "projects", label: "Projets" },
  { id: "contact", label: "Contact" },
];

const socials = [
  { icon: Github, href: "https://github.com/AaronKAME200308", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/aaron-kame-mouele-b82619289/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:aaronmouele11@gmail.com", label: "Email" },
];

export default function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{`
        .footer-root {
          background: linear-gradient(170deg, #0f0b1e 0%, #12112b 50%, #0c1628 100%);
          position: relative;
          overflow: hidden;
        }
        .footer-root::before {
          content: '';
          position: absolute;
          top: -120px; left: -80px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-root::after {
          content: '';
          position: absolute;
          bottom: -60px; right: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset;
        }
        .footer-social-btn {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.55);
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .footer-social-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 45%;
          background: rgba(255,255,255,0.07);
          pointer-events: none;
        }
        .footer-social-btn:hover {
          background: linear-gradient(135deg, rgba(124,58,237,0.35), rgba(59,130,246,0.25));
          border-color: rgba(124,58,237,0.4);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124,58,237,0.25);
        }
        .footer-nav-link {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 0;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
          text-align: left;
        }
        .footer-nav-link:hover {
          color: rgba(255,255,255,0.9);
        }
        .footer-nav-link:hover .link-arrow {
          opacity: 1;
          transform: translate(2px, -2px);
        }
        .link-arrow {
          opacity: 0;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(124,58,237,0.2) 50%, rgba(255,255,255,0.1) 70%, transparent);
        }
        .footer-logo-glow {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          box-shadow: 0 2px 16px rgba(124,58,237,0.5), 0 0 30px rgba(124,58,237,0.2), 0 1px 0 rgba(255,255,255,0.25) inset;
        }
        .footer-cta {
          background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.15));
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 16px;
          padding: 20px 24px;
          position: relative;
          overflow: hidden;
        }
        .footer-cta::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: rgba(255,255,255,0.04);
          pointer-events: none;
        }
        .footer-cta-btn {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          box-shadow: 0 3px 14px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.2) inset;
          border: none;
          color: white;
          padding: 10px 22px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .footer-cta-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: rgba(255,255,255,0.15);
          pointer-events: none;
        }
        .footer-cta-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 22px rgba(124,58,237,0.55), 0 1px 0 rgba(255,255,255,0.25) inset;
        }
        .dot-grid {
          position: absolute;
          top: 24px; right: 24px;
          opacity: 0.06;
        }
      `}</style>

      <footer className="footer-root" style={{ paddingTop: 64, paddingBottom: 32 }}>
        {/* Decorative dot grid */}
        <svg className="dot-grid" width="120" height="120">
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => (
              <circle key={`${r}-${c}`} cx={c * 22 + 11} cy={r * 22 + 11} r="2" fill="#a78bfa" />
            ))
          )}
        </svg>

        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

          {/* Top grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 48 }}>

            {/* Brand column */}
            <div style={{ gridColumn: "span 1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className="footer-logo-glow" style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Code2 size={18} color="white" />
                </div>
                <div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "white", margin: 0, lineHeight: 1.2 }}>
                    Aaron KAME
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>Full-Stack Developer</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: "0 0 20px" }}>
                Développeur freelance passionné par la création d'expériences web et mobile élégantes.
              </p>
              {/* Socials */}
              <div style={{ display: "flex", gap: 8 }}>
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} className="footer-social-btn">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>
                Navigation
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {navLinks.map((l) => (
                  <li key={l.id}>
                    <button onClick={() => scrollTo(l.id)} className="footer-nav-link">
                      {l.label}
                      <ArrowUpRight size={12} className="link-arrow" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>
                Contact
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: Mail, value: "aaronmouele11@gmail.com", href: "mailto:aaronmouele11@gmail.com" },
                  { icon: Phone, value: "+237 670 464 488", href: "tel:+237670464488" },
                  { icon: MapPin, value: "Yaoundé, Cameroun", href: null },
                ].map(({ icon: Icon, value, href }) => (
                  <div key={value} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={13} color="rgba(167,139,250,0.9)" />
                    </div>
                    {href ? (
                      <a href={href} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.85)"}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)"}
                      >{value}</a>
                    ) : (
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="footer-cta">
              <p style={{ fontSize: 15, fontWeight: 600, color: "white", margin: "0 0 6px" }}>
                Vous avez un projet ?
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 16px", lineHeight: 1.6 }}>
                Je suis disponible pour de nouvelles missions freelance.
              </p>
              <button onClick={() => scrollTo("contact")} className="footer-cta-btn">
                Démarrons ensemble
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider" style={{ marginBottom: 24 }} />

          {/* Bottom bar */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>
              © {new Date().getFullYear()} Aaron KAME MOUELE — Tous droits réservés.
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              Fait avec
              <Heart size={12} color="#f43f5e" fill="#f43f5e" />
              en React + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
