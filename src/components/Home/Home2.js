import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
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
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              I fell in love with programming and have built a lot of exciting
              things along the way! 🚀
              <br />
              <br />I am fluent in
              <i>
                <b className="purple">  Python, JavaScript and Java </b>
              </i>
              — the languages that power the modern tech world.
              <br />
              <br />
              My field of interest includes building new&nbsp;
              <i>
                <b className="purple">Web Technologies and Products </b> and
                working on <b className="purple">MERN stack applications and AI-driven solutions.</b>
              </i>
              <br />
              <br />
              Whenever possible, I also apply my passion for developing products
              with <b className="purple">Node.js</b> and
              <i>
                <b className="purple">
                  {" "}
                  modern JavaScript libraries and frameworks
                </b>
              </i>
              &nbsp; like
              <i>
                <b className="purple"> React.js and Expo Router.</b>
              </i>{" "}
              I also work with Firebase, MongoDB, and Clerk for authentication and backend services.
            </p>
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
