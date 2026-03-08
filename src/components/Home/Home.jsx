import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Particle from "../Particle";
import Home2 from "./Home2";
import ParticlePortrait from "./ParticlePortrait";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

function Home() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row className="flex-column-reverse flex-md-row">
            <Col md={7} className="home-header">


              <motion.h1
                className="heading-name"
                style={{
                  paddingBottom: 15,
                  marginBottom: 0,
                }}
              >
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(400)
                      .typeString('hi ')
                      .pasteString('<span class="wave" role="img" aria-labelledby="wave">👋🏻</span>')
                      .typeString(', <strong class="main-name">guru</strong> here.')
                      .start();
                  }}
                  options={{
                    cursor: '|',
                    autoStart: false,
                    loop: false,
                    delay: 60
                  }}
                />
              </motion.h1>

              <motion.div
                className="home-header-text"
                style={{ paddingLeft: 0, paddingTop: 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                <motion.p
                  className="home-about-body"
                  style={{ fontSize: "0.8rem", paddingTop: "0px", color: "#e2c6ff", maxWidth: "80%", fontWeight: 300, lineHeight: 1.6 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  I'm a Software Engineer and Full Stack Developer based in India, currently working at a startup where I build and maintain real-world applications. I enjoy working across different technologies and continuously learning to create scalable and impactful products.
                </motion.p>
              </motion.div>
            </Col>

            <Col md={5} style={{ paddingBottom: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="particle-wrapper"
              >
                <ParticlePortrait />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </Container>
      <Home2 />
    </section>
  );
}

export default Home;
