import { useState } from "react";
import { ExternalLink, Github, Globe, Leaf } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "PlantGuard AI",
    subtitle: "Application mobile IA",
    description:
      "Application mobile permettant la détection des maladies des plantes grâce à l'intelligence artificielle. Modèle de vision par ordinateur entraîné sur des milliers d'images de feuilles.",
    tags: ["React Native", "FastAPI", "Python", "TensorFlow", "PostgreSQL"],
    icon: Leaf,
    color: "emerald",
    type: "Mobile + IA",
    status: "Terminé",
    gradient: "from-emerald-400 to-teal-500",
    bgLight: "from-emerald-50 to-teal-50",
  },
  {
    id: 2,
    title: "TravelScape",
    subtitle: "Site de voyage",
    description:
      "Plateforme de voyage moderne avec exploration de destinations, galeries d'images immersives et interface de réservation. Design soigné, navigation fluide.",
    tags: ["React JS", "Tailwind CSS", "Node.js", "Supabase"],
    icon: Globe,
    color: "blue",
    type: "Web",
    status: "Terminé",
    gradient: "from-blue-400 to-indigo-500",
    bgLight: "from-blue-50 to-indigo-50",
  },
  {
    id: 3,
    title: "Mon Portfolio",
    subtitle: "Site personnel",
    description:
      "Portfolio personnel présentant mon profil, mes compétences et mes projets. Design clair et épuré, entièrement construit avec React et Tailwind CSS.",
    tags: ["React JS", "Tailwind CSS"],
    icon: Globe,
    color: "violet",
    type: "Web",
    status: "En ligne",
    gradient: "from-violet-400 to-purple-500",
    bgLight: "from-violet-50 to-purple-50",
  },
  {
    id: 4,
    title: "Vitrine Pro",
    subtitle: "Site vitrine entreprise",
    description:
      "Site vitrine pour une entreprise locale, avec présentation des services, témoignages clients et formulaire de contact intégré.",
    tags: ["React JS", "Tailwind CSS", "PHP", "MySQL"],
    icon: Globe,
    color: "amber",
    type: "Web",
    status: "Livré",
    gradient: "from-amber-400 to-orange-500",
    bgLight: "from-amber-50 to-orange-50",
  },
];

const colorMap: Record<string, { badge: string; tag: string; btn: string }> = {
  violet: {
    badge: "bg-violet-100 text-violet-700",
    tag: "bg-violet-50 text-violet-600 border-violet-100",
    btn: "hover:text-violet-600 hover:border-violet-200",
  },
  blue: {
    badge: "bg-blue-100 text-blue-700",
    tag: "bg-blue-50 text-blue-600 border-blue-100",
    btn: "hover:text-blue-600 hover:border-blue-200",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700",
    tag: "bg-emerald-50 text-emerald-600 border-emerald-100",
    btn: "hover:text-emerald-600 hover:border-emerald-200",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    tag: "bg-amber-50 text-amber-600 border-amber-100",
    btn: "hover:text-amber-600 hover:border-amber-200",
  },
};

export default function Projects() {

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-12 bg-violet-300" />
          <span className="text-violet-500 font-semibold text-sm uppercase tracking-widest">
            Projets
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900">
            Ce que j'ai construit
          </h2>
          <p className="text-slate-500 max-w-xs text-sm">
            Des projets concrets, du prototype à la mise en production.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const cfg = colorMap[project.color];
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                className={`group relative rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Top gradient banner */}
                <div
                  className={`h-40 bg-linear-to-br ${project.bgLight} relative overflow-hidden flex items-center justify-center`}
                >
                  {/* Decorative circles */}
                  <div
                    className={`absolute -top-6 -right-6 w-32 h-32 rounded-full bg-linear-to-br ${project.gradient} opacity-20`}
                  />
                  <div
                    className={`absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-linear-to-br ${project.gradient} opacity-10`}
                  />
                  {/* Icon */}
                  <div
                    className={`relative w-16 h-16 rounded-2xl bg-linear-to-br ${project.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  {/* Status badge */}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${cfg.badge}`}
                  >
                    {project.status}
                  </span>
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/70 backdrop-blur text-slate-600">
                    {project.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{project.subtitle}</p>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium ${cfg.btn} transition-all`}
                    >
                      <Github size={14} />
                      Code
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium ${cfg.btn} transition-all`}
                    >
                      <ExternalLink size={14} />
                      Voir le projet
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
