import React, { useState, useRef } from "react";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Container } from "react-bootstrap";
import Particle from "../Particle";
import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedinIn, FaGithub, FaPaperPlane } from "react-icons/fa";
import "./Contact.css";

function Contact() {
    const formRef = useRef();
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("sending");

        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
        fetch(`${apiUrl}/api/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
            .then(async (response) => {
                if (response.ok) {
                    setStatus("success");
                    setForm({ name: "", email: "", message: "" });
                } else {
                    setStatus("error");
                }
            })
            .catch(() => setStatus("error"));
    };

    return (
        <Container fluid className="contact-section">
            <Particle />
            <Container className="contact-container">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="contact-header"
                >
                    <h1>
                        Get In <span className="purple">Touch</span>
                    </h1>
                    <p>Have a project in mind or just want to say hi? My inbox is always open.</p>
                </motion.div>

                <div className="contact-grid">
                    {/* Left — Info */}
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="contact-info-card">
                            <h3>Let's talk</h3>
                            <p>
                                Whether you have a project in mind, a technical question, or just want to check in and say hi, my inbox is always open. I'll do my best to get back to you!
                            </p>
                            <div className="contact-links">
                                <a href="mailto:guruthedev20@gmail.com" className="contact-link-item">
                                    <FaEnvelope /> guruthedev20@gmail.com
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/gurunath-s-85129a217/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="contact-link-item"
                                >
                                    <FaLinkedinIn /> linkedin.com/in/gurunath-s
                                </a>
                                <a
                                    href="https://github.com/Gurunath-S"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="contact-link-item"
                                >
                                    <FaGithub /> github.com/Gurunath-S
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        className="contact-form-wrap"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Hi, I'd like to talk about..."
                                    required
                                />
                            </div>
                            <motion.button
                                type="submit"
                                className="submit-btn"
                                disabled={status === "sending"}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {status === "sending" ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <FaPaperPlane /> &nbsp;Send Message
                                    </>
                                )}
                            </motion.button>
                            {status === "success" && (
                                <p className="form-success">
                                    Message sent! I'll get back to you soon.
                                </p>
                            )}
                            {status === "error" && (
                                <p className="form-error">
                                    Something went wrong. Please email me directly.
                                </p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </Container>
        </Container>
    );
}

export default Contact;
