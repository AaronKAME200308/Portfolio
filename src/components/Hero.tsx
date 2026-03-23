import { ArrowDown, Github, Linkedin, Mail, Sparkles } from "lucide-react";

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-slate-50"
    >
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-150 h-150 rounded-full bg-linearm-violet-100 to-blue-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-100 h-100 rounded-full bg-linear-to-tr from-emerald-100 to-teal-100 opacity-50 blur-3xl" />
        {/* Geometric dots grid */}
        <svg className="absolute top-20 left-10 opacity-10" width="200" height="200">
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) => (
              <circle key={`${r}-${c}`} cx={c * 30 + 15} cy={r * 30 + 15} r="2.5" fill="#7c3aed" />
            ))
          )}
        </svg>
        <svg className="absolute bottom-24 right-16 opacity-10" width="160" height="160">
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => (
              <circle key={`${r}-${c}`} cx={c * 30 + 15} cy={r * 30 + 15} r="2.5" fill="#059669" />
            ))
          )}
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-violet-100 shadow-sm text-violet-600 text-sm font-medium">
            <Sparkles size={14} className="text-emerald-500" />
            Développeur Freelance disponible
          </div>

          {/* Heading */}
          <div>
            <p className="text-slate-500 font-medium text-lg mb-1">Bonjour, je suis</p>
            <h1 className="font-display text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Aaron
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                KAME MOUELE
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-slate-600 text-lg leading-relaxed max-w-md">
            Développeur Web & Mobile Full-Stack passionné par la création
            d'interfaces élégantes et d'APIs robustes. Spécialisé en{" "}
            <span className="text-violet-600 font-semibold">React</span>,{" "}
            <span className="text-blue-600 font-semibold">FastAPI</span> &{" "}
            <span className="text-emerald-600 font-semibold">IA/ML</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => scrollTo("projects")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              Voir mes projets
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-6 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-violet-300 hover:text-violet-600 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              Me contacter
            </button>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-slate-400 text-sm">Retrouvez-moi :</span>
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "#contact", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-violet-600 hover:border-violet-200 hover:shadow-md transition-all duration-200"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Visual card / avatar area */}
        <div className="flex justify-center md:justify-end">
          <div className="relative">
            {/* Main card */}
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-[2.5rem] bg-gradient-to-br from-violet-100 via-white to-blue-50 border border-white shadow-2xl shadow-violet-100 flex items-center justify-center overflow-hidden">
              {/* Placeholder avatar */}
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white text-5xl font-black shadow-lg">
                  AK
                </div>
                <p className="text-slate-700 font-bold text-lg">Aaron KAME</p>
                <p className="text-slate-400 text-sm">Full-Stack Developer</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 px-3 py-2 rounded-xl bg-white shadow-lg border border-emerald-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">React Native</span>
            </div>
            <div className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl bg-white shadow-lg border border-violet-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-xs font-semibold text-slate-700">FastAPI + IA</span>
            </div>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 px-3 py-2 rounded-xl bg-white shadow-lg border border-blue-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs font-semibold text-slate-700">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-violet-500 transition-colors animate-bounce"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ArrowDown size={16} />
      </button>
    </section>
  );
}
