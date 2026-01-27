import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";

const App = () => {

  return (
    <div className="min-h-screen w-screen flex flex-col bg-portfolio-bg text-white">
      <Navbar />
        <Main />      
      <Footer />
    </div>
  );
};

export default App;
