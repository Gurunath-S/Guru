import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { motion } from "framer-motion";
import chatapp from "../../Assets/Projects/chatapp.png";
import bda4 from "../../Assets/Projects/bda4.png";
import sfa from "../../Assets/Projects/sfa.png";
import docapp from "../../Assets/Projects/docapp.png";

const projectData = [
  {
    imgPath: chatapp,
    title: "Chat Application",
    description:
      "A real-time chat room built with React.js, Material-UI, and Firebase. Features real-time messaging, image sharing, and emoji reactions.",
    ghLink: "https://github.com/Gurunath-S/Chat-Application",
    demoLink: "https://groupchat-application.vercel.app/",
    tags: ["React", "Firebase", "Material-UI"],
  },
  {
    imgPath: sfa,
    title: "Personal Finance Advisor",
    description:
      "A MERN stack finance app. Tracks income/expenses, visualizes data with graphs, and gives investment suggestions based on user savings.",
    ghLink: "https://github.com/Gurunath-S/Personal-Finance-App",
    demoLink: "https://smart-finance-adviser.vercel.app/",
    tags: ["MERN", "React", "MongoDB"],
  },
  {
    imgPath: bda4,
    title: "Business Directory App",
    description:
      "A MERN stack app where users can discover, add, and manage businesses with secure authentication. Only owners can delete their listings.",
    ghLink: "https://github.com/Gurunath-S/Business-directory-app",
    tags: ["MERN", "MongoDB", "Express"],
  },
  {
    imgPath: docapp,
    title: "Doctor Appointment Booking",
    description:
      "A web-based Doctor Appointment Booking System that allows patients to schedule consultations with doctors and manage appointments online.",
    ghLink: "https://github.com/Gurunath-S/doctor-webapp",
    demoLink: "https://doctor-webapp-frontend.vercel.app/",
    tags: ["React", "Node.js", "MongoDB"],
  },
];

const allTags = ["All", "React", "MERN", "Firebase", "MongoDB", "Node.js", "Express", "Material-UI"];

function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? projectData
      : projectData.filter((p) => p.tags.includes(activeFilter));

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="project-heading">
            My Recent <strong className="purple">Works</strong>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "30px" }}>
            Here are a few projects I've worked on recently.
          </p>

          {/* Filter Tags */}
          <div className="filter-tags">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`filter-tag ${activeFilter === tag ? "active" : ""}`}
                onClick={() => setActiveFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {filtered.map((project, idx) => (
            <Col md={3} className="project-card" key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ProjectCard
                  imgPath={project.imgPath}
                  isBlog={false}
                  title={project.title}
                  description={project.description}
                  ghLink={project.ghLink}
                  demoLink={project.demoLink}
                  tags={project.tags}
                />
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
