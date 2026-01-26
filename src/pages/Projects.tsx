import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    title: "Détection de maladies de plantes",
    description: "Pipeline complet : YOLOv5 (détection) → EfficientNet (classification) → FastAPI (API).",
    tech: "Python · PyTorch · FastAPI · React Native",
    video :"@/public/Soitenance.mp4",
    link: "#",
  },
  {
    title: "Gestion de Blog",
    description: "Système de blog multi-rôles: Admin, Écrivain, Lecteur. Pagination, CRUD, auth.",
    tech: "React · Bootstrap · MySQL",    
    link: "#",
  },
  {
    title: "Application Mail (Local)",
    description: "Expérience pratique SMTP/IMAP avec PHPMailer & hMailServer.",
    tech: "PHP · hMailServer",
    link: "#",
  },
];

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12 },
  },
};

const Projects = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h2 className="text-4xl font-bold">Projets</h2>
        <p className="text-white/80 mt-2">Sélection de projets techniques et IA — démonstrations & code.</p>
      </motion.header>

      <motion.section variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <motion.div key={p.title} whileHover={{ y: -6 }} className="">
            <ProjectCard project={p} />
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
};

export default Projects;
