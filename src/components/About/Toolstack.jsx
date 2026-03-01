import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiWindows,
  SiVisualstudiocode,
  SiPostman,
  SiVercel,
  SiGithub,
  SiExpo,
  SiFirebase,
  SiLinux,
  SiFedora,
} from "react-icons/si";
import { FaUserShield } from "react-icons/fa";
import cohereImg from "../../Assets/cohere.png";

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <SiWindows />
        <h5>Windows</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiLinux />
        <h5>Linux</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiFedora />
        <h5>Fedora</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiVisualstudiocode />
        <h5>VS Code</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiPostman />
        <h5>Postman</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiVercel />
        <h5>Vercel</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiGithub />
        <h5>Github</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiExpo />
        <h5>Expo</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaUserShield />
        <h5>Clerk</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiFirebase />
        <h5>Firebase</h5>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <img
          src={cohereImg}
          alt="Cohere"
          style={{ width: "40px", height: "40px", objectFit: "contain" }}
        />
        <h5>Cohere</h5>
      </Col>
    </Row>
  );
}

export default Toolstack;
