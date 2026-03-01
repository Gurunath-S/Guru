import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn, FaEnvelope } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();

  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3>Designed and Developed by Guru</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3>Copyright © {year} GN</h3>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-social-list">
            <li className="social-icons">
              <a
                href="https://github.com/Gurunath-S"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="footer-social-icon"
              >
                <AiFillGithub />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://leetcode.com/Gurunath_S/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode Profile"
                className="footer-social-icon"
              >
                <SiLeetcode />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://www.linkedin.com/in/gurunath-s-85129a217/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="footer-social-icon"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="mailto:guruthedev20@gmail.com"
                aria-label="Send Email"
                className="footer-social-icon"
              >
                <FaEnvelope />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
