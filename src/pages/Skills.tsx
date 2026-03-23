import { useState } from "react";
import {
  Code2, Server, Database, Brain, Layers,
} from "lucide-react";

const categories = [
  {
    id: "frontend",
    icon: Code2,
    label: "Front-end",
    color: "violet",
    skills: [
      { name: "React JS", level: 95 },
      { name: "React Native", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "HTML / CSS", level: 98 },
      { name: "JavaScript", level: 90 },
    ],
  },
  {
    id: "backend",
    icon: Server,
    label: "Back-end",
    color: "blue",
    skills: [
      { name: "FastAPI (Python)", level: 85 },
      { name: "Node.js / Express", level: 80 },
      { name: "PHP / Symfony", level: 75 },
      { name: "Java", level: 70 },
      { name: "REST API", level: 88 },
    ],
  },
  {
    id: "database",
    icon: Database,
    label: "Bases de données",
    color: "emerald",
    skills: [
      { name: "PostgreSQL", level: 85 },
      { name: "Supabase", level: 82 },
      { name: "SQL", level: 88 },
    ],
  },
  {
    id: "ai",
    icon: Brain,
    label: "IA / ML",
    color: "rose",
    skills: [
      { name: "Python", level: 82 },
      { name: "TensorFlow / Keras", level: 70 },
      { name: "Computer Vision", level: 68 },
    ],
  },
  {
    id: "methods",
    icon: Layers,
    label: "Conception",
    color: "amber",
    skills: [
      { name: "UML / Merise", level: 85 },
      { name: "Architecture logicielle", level: 80 },
      { name: "Git / GitHub", level: 90 },
    ],
  },
];

const colorConfig: Record<string, { tab: string; bar: string; icon: string; dot: string }> = {
  violet: {
    tab: "border-violet-500 text-violet-600 bg-violet-50",
    bar: "from-violet-400 to-violet-600",
    icon: "bg-violet-100 text-violet-600",
    dot: "bg-violet-500",
  },
  blue: {
    tab: "border-blue-500 text-blue-600 bg-blue-50",
    bar: "from-blue-400 to-blue-600",
    icon: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
  },
  emerald: {
    tab: "border-emerald-500 text-emerald-600 bg-emerald-50",
    bar: "from-emerald-400 to-emerald-600",
    icon: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
  },
  rose: {
    tab: "border-rose-500 text-rose-600 bg-rose-50",
    bar: "from-rose-400 to-rose-600",
    icon: "bg-rose-100 text-rose-600",
    dot: "bg-rose-500",
  },
  amber: {
    tab: "border-amber-500 text-amber-600 bg-amber-50",
    bar: "from-amber-400 to-amber-600",
    icon: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
  },
};

export default function Skills() {
  const [active, setActive] = useState("frontend");
  const current = categories.find((c) => c.id === active)!;
  const cfg = colorConfig[current.color];

  return (
    <section id="skills" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-12 bg-violet-300" />
          <span className="text-violet-500 font-semibold text-sm uppercase tracking-widest">
            Compétences
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 mb-12">
          Mon stack technique
        </h2>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                  isActive
                    ? colorConfig[cat.color].tab + " shadow-sm"
                    : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                }`}
              >
                <Icon size={15} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Skills panel */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Progress bars */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
            <div className={`flex items-center gap-3 mb-8`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.icon}`}>
                <current.icon size={20} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-800">{current.label}</h3>
            </div>
            {current.skills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 text-sm font-medium">{skill.name}</span>
                  <span className="text-slate-400 text-xs font-semibold">{skill.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${cfg.bar} transition-all duration-700`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skill pills / tags */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="font-display font-bold text-xl text-slate-800 mb-6">
              Toutes mes technologies
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {[
                "React JS", "React Native", "Tailwind CSS", "JavaScript",
                "TypeScript", "HTML5", "CSS3",
                "FastAPI", "Node.js", "Express", "PHP", "Symfony", "Java",
                "Python", "TensorFlow",
                "PostgreSQL", "Supabase", "MySQL",
                "Git", "GitHub", "Figma", "VS Code",
                "UML", "Merise", "REST API",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
