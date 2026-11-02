import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";



function NavBar({ gameMode = false, onToggleGameMode = () => {} }) {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);

  useEffect(() => {
    function scrollHandler() {
      if (window.scrollY >= 20) {
        updateNavbar(true);
      } else {
        updateNavbar(false);
      }
    }
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex" style={{ marginLeft: 0 }}>
          <h1 style={{ padding: 0, margin: 0, color: "purple", fontFamily: "Space Grotesk, fantasy" }}>
            GN
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => updateExpanded(expand ? false : "expanded")}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto align-items-md-center" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link href="#home" onClick={() => updateExpanded(false)}>
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#about" onClick={() => updateExpanded(false)}>
                About
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#projects" onClick={() => updateExpanded(false)}>
                Projects
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#contact" onClick={() => updateExpanded(false)}>
                Contact
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="ms-md-3 my-2 my-md-0">
              <button
                type="button"
                className={`game-mode-nav-btn ${gameMode ? "active" : ""}`}
                onClick={() => {
                  onToggleGameMode();
                  updateExpanded(false);
                }}
                title={gameMode ? "Exit Game Mode" : "Activate Game Mode"}
                aria-label="Toggle Game Mode"
              >
                <span className="game-mode-icon">🎮</span>
                <span className="game-mode-text">Game Mode</span>
                <span className={`game-mode-badge ${gameMode ? "on" : "off"}`}>
                  {gameMode ? "ON" : "OFF"}
                </span>
              </button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
