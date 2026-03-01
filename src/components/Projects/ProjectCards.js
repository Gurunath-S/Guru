import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

function ProjectCards(props) {
  return (
    <Card className="project-card-view">
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      <Card.Body>
        <Card.Title
          style={{
            color: "#E0B3FF",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: "700",
            fontSize: 20,
            letterSpacing: 0.5,
            textAlign: "center",
          }}
        >
          {props.title}
        </Card.Title>

        {/* Tech tags */}
        {props.tags && (
          <div className="project-tags">
            {props.tags.map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <Card.Text style={{ textAlign: "justify", fontSize: "0.88em", color: "rgba(255,255,255,0.75)" }}>
          {props.description}
        </Card.Text>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" href={props.ghLink} target="_blank">
            <BsGithub /> &nbsp;GitHub
          </Button>
          {!props.isBlog && props.demoLink && (
            <Button variant="primary" href={props.demoLink} target="_blank">
              <CgWebsite /> &nbsp;Demo
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProjectCards;
