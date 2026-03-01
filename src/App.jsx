import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Contact from "./components/Contact/Contact";
import Cursor from "./components/Cursor";
import BackToTop from "./components/BackToTop";

import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [load, updateLoad] = useState(true);

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
        <div className="main-content">
          <div id="home"><Home /></div>
          <div id="about"><About /></div>
          <div id="projects"><Projects /></div>
          <div id="contact"><Contact /></div>
        </div>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}

export default App;
