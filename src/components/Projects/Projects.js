import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
// Project images
import chatapp from "../../Assets/Projects/chatapp.png";
import bda4 from "../../Assets/Projects/bda4.png";
import sfa from "../../Assets/Projects/sfa.png";
import docapp from "../../Assets/Projects/docapp.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />

      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works</strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={3} className="project-card">
            <ProjectCard
              imgPath={chatapp}
              isBlog={false}
              title="Chat Application"
              description={`A personal chat room or workspace built with React.js, Material-UI, and Firebase. Features real-time messaging, image sharing, and emoji reactions.`}
              ghLink="https://github.com/Gurunath-S/Chat-Application"
              demoLink="https://groupchat-application.vercel.app/"
            />
          </Col>

          <Col md={3} className="project-card">
            <ProjectCard
              imgPath={sfa}
              isBlog={false}
              title="Personal Finance Advisor"
              description={`A personal finance management web app built using the MERN stack. Tracks income/expenses, visualizes data with graphs, and gives investment suggestions based on user savings.`}
              ghLink="https://github.com/Gurunath-S/Personal-Finance-App"
              demoLink="https://smart-finance-adviser.vercel.app/"
            />
          </Col>

          <Col md={3} className="project-card">
            <ProjectCard
              imgPath={bda4}
              isBlog={false}
              title="Business Directory App"
              description={`A MERN stack app where users can discover, add, and manage businesses with secure authentication. Only owners can delete their listings.`}
              ghLink="https://github.com/Gurunath-S/Business-directory-app"
            />
          </Col>

          <Col md={3} className="project-card">
            <ProjectCard
              imgPath={docapp}
              isBlog={false}
              title="Doctor Appointment Booking System"
              description={`A web-based Doctor Appointment Booking System that allows patients to easily schedule consultations with doctors and manage appointments online.`}
              ghLink="https://github.com/Gurunath-S/doctor-webapp"
              demoLink="https://doctor-webapp-frontend.vercel.app/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
