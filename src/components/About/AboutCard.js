import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
        <p style={{ textAlign: "justify" }}>
          Hi Everyone, I am <span className="purple">Gurunath S </span>
          from <span className="purple">Tirupur, India.</span>
          <br />
          I am a passionate Full Stack Developer with a strong love for crafting
          clean, innovative, and efficient digital solutions.
          <br />
          <br />
          I have recently completed my <span className="purple">Master of Computer Applications (MCA)</span>,
          where I gained in-depth knowledge in areas such as Web Development, Database Management,
          Software Engineering, and Data Structures.
          <br />
          I also hold a  <span className="purple">Bachelor's degree in Computer Science</span>, which laid the foundation
          for my journey into the world of technology.
          <br />
          During my academic years, I actively worked on several projects that helped me build
          hands-on experience with modern web technologies and frameworks.
          <br />
          <br />
          Apart from coding, some other activities that I love to do!
        </p>
          <ul>
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

          <p style={{ color: "rgb(155 126 172)" }}>
            "Keep building, keep learning, and make an impact!"{" "}
          </p>
          <footer className="blockquote-footer">Guru</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
