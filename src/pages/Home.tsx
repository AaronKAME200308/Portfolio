import { motion } from "framer-motion";

const buttonHover = { scale: 1.03 };

const Home = () => {
  const mainSection = {
    portfolio: "Portfolio",
    title: "Aaron KAME MOUELE",
    subtitle: "Développeur Web & Mobile",
    description:
      "Du code à l’intelligence : je bâtis des apps complètes et smart.",
    textColor: "#0072FF",
    bgColor: "#EBF4F6",
    nextColor: "#7AB2B2",
    skills: [
      { name: "AI / ML", color: "#982598" },
      { name: "Frontend", color: "#E491C9" },
      { name: "Backend", color: "#15173D" },
    ],
  };

  return (
    <section
      id="Accueil"
      style={{
        background: mainSection.bgColor,
      }}
      className="
        w-full
        min-h-screen          /* prend toute la hauteur écran */
        flex
        items-center          /* centre vertical */
        justify-center        /* centre horizontal */
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
      "
    >
      {/* ===== CONTENEUR PRINCIPAL ===== */}
      <div
        className="
          w-full
          max-w-5xl            /* largeur lisible */
          mx-auto
          flex
          flex-col
          items-center
          text-center
        "
      >
        {/* ===== HEADER ===== */}
        <div className="space-y-4 md:space-y-8">
          
          {/* Portfolio - Animation écriture */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="mt-8 font-caveat italic text-3xl md:text-4xl inline-block"
              style={{
                color: mainSection.textColor,
                opacity: 0.75,
                fontWeight: 600,
              }}
            >
              {mainSection.portfolio.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: index * 0.1,
                  }}
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* NOM */}
          <motion.h1
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.0,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="
              text-5xl
              md:text-7xl
              font-black
              leading-tight
              mb-6 md:mb-8
            "
            style={{
              color: "#0F2854",
              textShadow: `0 0 40px ${mainSection.textColor}20`,
            }}
          >
            {mainSection.title}
          </motion.h1>

          {/* SUBTITLE */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="
              text-xl
              md:text-3xl
              font-bold
              mb-4 md:mb-6
            "
            style={{ color: "#0F2854", opacity: 0.85 }}
          >
            {mainSection.subtitle}
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="
              font-caveat
              text-base
              md:text-2xl
              italic
              max-w-3xl
              mx-auto
              leading-relaxed
              mt-2 md:mt-4
            "
            style={{ color: "#0F2854" }}
          >
            {mainSection.description}
          </motion.p>
        </div>

        {/* ===== BUTTONS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
          className="
            flex
            flex-wrap
            justify-center
            gap-4
            mt-10 md:mt-12
          "
        >
          {/* BTN 1 */}
          <motion.button
            whileHover={buttonHover}
            className="px-8 py-4 rounded-full font-bold text-lg shadow-xl"
            style={{
              background: mainSection.textColor,
              color: "#fff",
            }}
          >
            Voir mes projets
          </motion.button>

          {/* BTN 2 */}
          <motion.button
            whileHover={buttonHover}
            className="
              px-8
              py-4
              rounded-full
              border-2
              font-bold
              text-lg
              backdrop-blur-xl
            "
            style={{
              borderColor: mainSection.textColor,
              color: mainSection.textColor,
              background: "rgba(255, 255, 255, 0.3)",
            }}
          >
            Me contacter
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
