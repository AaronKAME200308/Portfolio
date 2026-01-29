import { motion } from "framer-motion";
import LogoSlider
  from "../components/LogoSlide";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <motion.h2 initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-3xl font-bold mb-4">
        À propos
      </motion.h2>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-white/85 leading-relaxed">
        Je suis un <strong>Développeur Web & Mobile</strong>, passionné par le développement logiciel, 
        le web et l’intelligence artificielle, je conçois des applications modernes en combinant performance, 
        design et bonnes pratiques.
        J’ai une approche orientée solution, avec un fort intérêt pour les technologies full-stack et les systèmes 
        intelligents appliqués à des problématiques réelles.par exemple mon projet de détection de maladies de tomates qui condense l'essentiel de mes compétences en IA et développement web.   
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="h-40 mt-10">
        <LogoSlider />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }} className="p-6 bg-white/5 rounded-2xl">
          <h4 className="font-semibold mb-2">Compétences principales</h4>
          <ul className="text-sm text-white/80 space-y-2">
            <li>• Deep Learning (PyTorch, EfficientNet)</li>
            <li>• Vision par ordinateur (YOLOv5)</li>
            <li>• Backend (FastAPI, Node.js)</li>
            <li>• Frontend (React, TypeScript, Tailwind)</li>
            <li>• Bases de données (MySQL)</li>
          </ul>
        </motion.div>

        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25 }} className="p-6 bg-white/5 rounded-2xl">
          <h4 className="font-semibold mb-2">Outils & Workflow</h4>
          <p className="text-sm text-white/80">
            Git (GitHub), Docker (pour prototyper), VSCode, Figma pour le design d'interfaces, et méthodologie itérative (test & déploiement local).
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
