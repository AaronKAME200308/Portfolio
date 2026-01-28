import Home from "../pages/Home";
import Projects from "../pages/Projects";
import About from "../pages/About";
import Contact from "../pages/Contact";

const Main = () => {
    return (
        <main>
            <section id="Accueil">
                <Home />
            </section>



            <section id="À propos">
                <About />
            </section>

            <section id="Projets">
                <Projects />
            </section>
            
            <section id="Contact">
                <Contact />
            </section>
        </main>
    );
};

export default Main;
