import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './sections/Home'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import CustomCursor from "./components/CustomCursor"
import Loader from "./components/Loader"

const App = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return; // wait until loader is done
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, [loaded]); // runs after loader completes

  return (
    <>
      {/* Loader — sits on top until assets are ready */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* Main app — hidden behind loader, shown once done */}
      <div
        className='relative gradient text-white'
        style={{
          visibility: loaded ? "visible" : "hidden",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <CustomCursor />
        <Navbar />
        <Home />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App