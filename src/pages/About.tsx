import { GraduationCap, Briefcase, MapPin, Heart } from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    color: "violet",
    title: "Formation",
    text: "Licence en Génie Informatique",
  },
  {
    icon: Briefcase,
    color: "blue",
    title: "Statut",
    text: "Freelance disponible pour missions",
  },
  {
    icon: MapPin,
    color: "emerald",
    title: "Localisation",
    text: "Yaoundé, Cameroun",
  },
  {
    icon: Heart,
    color: "rose",
    title: "Passion",
    text: "IA, interfaces créatives & clean code",
  },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-50 text-violet-600 border-violet-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-12 bg-violet-300" />
          <span className="text-violet-500 font-semibold text-sm uppercase tracking-widest">
            À propos
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-6">
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Passionné par le{" "}
              <span className="bg-linear-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                code
              </span>{" "}
              et le{" "}
              <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                design
              </span>
            </h2>

            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Je suis <strong className="text-slate-800">Aaron KAME MOUELE</strong>, développeur
                freelance Web & Mobile basé à Yaoundé. Titulaire d'une Licence en Génie Informatique,
                j'ai construit une expertise complète — du pixel au serveur.
              </p>
              <p>
                Ma spécialité ? Créer des interfaces React soignées et performantes, tout en
                concevant des APIs solides avec FastAPI ou Node.js. J'ai même entraîné des modèles
                d'IA pour la détection de maladies des plantes.
              </p>
              <p>
                J'aime le code propre, les projets qui ont du sens, et les collaborations où chaque
                détail compte.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-2">
              {[
                { value: "5+", label: "Projets livrés" },
                { value: "3+", label: "Ans d'expérience" },
                { value: "∞", label: "Lignes de code" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-3xl font-black text-violet-600">{value}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlight cards */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, color, title, text }) => (
              <div
                key={title}
                className={`group p-5 rounded-2xl border ${colorMap[color]} hover:scale-105 hover:shadow-md transition-all duration-200 cursor-default`}
              >
                <div className="mb-3">
                  <Icon size={22} />
                </div>
                <p className="font-bold text-slate-800 text-sm mb-1">{title}</p>
                <p className="text-slate-500 text-xs leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
