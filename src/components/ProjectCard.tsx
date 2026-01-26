import { motion } from "framer-motion";

export interface ProjectProps {
  title: string;
  description: string;
  tech?: string;
  img?: string;
  video?: string; // ✅ on ajoute une propriété vidéo
  link?: string;
}

const ProjectCard = ({ project }: { project: ProjectProps }) => {
  return (
    <motion.article
      whileHover={{ scale: 1.03, translateY: -6 }}
      className="bg-white/5 border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col h-full"
    >
      <div className="flex-1">
        {/* ✅ Section image ou vidéo */}
        <div className="h-40 rounded-lg overflow-hidden mb-4 flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-700">
          {project.video ? (
            <video
              controls
              muted
              playsInline
              controlsList="nodownload"
              className="w-full h-full object-contain"
            >
              <source src={project.video} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          ) : project.img ? (
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-semibold text-lg text-white/90">Aperçu</span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-blue-100 mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-white/80 mb-3">{project.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs italic text-purple-200">{project.tech}</span>
        <a
          href={project.link ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-xs font-medium shadow"
        >
          <p className="text-white">Voir</p>
        </a>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
