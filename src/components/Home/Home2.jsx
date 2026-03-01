import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import { ImPointRight } from "react-icons/im";
import Tilt from "react-parallax-tilt";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              ABOUT <span className="purple"> ME </span>
            </h1>
            <p className="home-about-body">
              I am a <span className="purple">Software Engineer</span> based in <span className="purple">Tiruppur</span>, currently working in a startup environment where I build and scale modern web applications. With a <span className="purple">Bachelor’s in Computer Science</span> and an <span className="purple">MCA</span>, I combine strong academic fundamentals with practical product development experience. I specialize in full-stack development using the <b className="purple">MERN stack</b>, building scalable backend systems with <b className="purple">Node.js</b> and crafting responsive frontends with <b className="purple">React.js</b>.
              <br />
              <br />
              I also work with tools like <b className="purple">MongoDB, Firebase, Clerk,</b> and <b className="purple">Expo Router</b> to deliver secure, real-time solutions. I’m focused on creating efficient, scalable architectures and exploring <b className="purple">AI-driven technologies</b> to build smarter digital products. I am particularly interested in <b className="purple">Machine Learning</b> and integrating <b className="purple">Large Language Models (LLMs)</b> to enhance application capabilities. Beyond the screen, I stay balanced and grounded by:
            </p>
            <ul style={{ listStyleType: "none", paddingLeft: "15px", fontSize: "1.2em", color: "white" }}>
              <li className="about-activity">
                <ImPointRight /> Watching Football & Exploring Tactical Analysis
              </li>
              <li className="about-activity">
                <ImPointRight /> Exploring New Tech & AI Tools
              </li>
              <li className="about-activity">
                <ImPointRight /> Watching Movies & Listening to Music
              </li>
            </ul>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/Gurunath-S"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub Profile"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://leetcode.com/u/Gurunath_S/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LeetCode Profile"
                  className="icon-colour home-social-icons"
                >
                  <SiLeetcode />
                </a>
              </li>

              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/gurunath-s-85129a217/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn Profile"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="mailto:guruthedev20@gmail.com"
                  aria-label="Send Email"
                  className="icon-colour home-social-icons"
                >
                  <FaEnvelope />
                </a>
              </li>

            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;
