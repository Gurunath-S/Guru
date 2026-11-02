import React, { useState, useEffect, Suspense, lazy } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import BackToTop from "./components/BackToTop";
import Arcade from "./components/Arcade/Arcade";
import Particle from "./components/Particle";

// Lazy Loaded Components for Code Splitting
const Home = lazy(() => import("./components/Home/Home"));
const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Contact = lazy(() => import("./components/Contact/Contact"));

import "./style.css";
import "./App.css";
import "./components/Arcade/Arcade.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [load, updateLoad] = useState(true);
  const [gameMode, setGameMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Cursor />
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <Particle />
        <div className="main-content">
          <Suspense fallback={<Preloader load={true} />}>
            <div id="home"><Home /></div>
            <div id="about"><About /></div>
            <div id="projects"><Projects /></div>
            <div id="contact"><Contact /></div>
          </Suspense>
        </div>
        <Footer />
        <BackToTop />

        {/* Global Game Mode Overlay Experience */}
        <Arcade 
          isOpen={gameMode} 
          onClose={() => setGameMode(false)} 
        />

        {/* Quick Launch Floating Game Mode Button */}
        {!gameMode && !load && (
          <button
            className="floating-game-mode-fab"
            onClick={() => setGameMode(true)}
            aria-label="Launch Game Mode"
            title="Launch Cyber-Shooter Game Mode"
          >
            <span className="fab-icon">🎮</span>
            <span className="fab-label">Game Mode</span>
            <span className="fab-pulse-ring"></span>
          </button>
        )}
      </div>
    </>
  );
}

export default App;
