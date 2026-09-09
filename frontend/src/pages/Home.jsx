import React from 'react';
import { FileText, Brain, Target, HelpCircle, Sparkles, LogOut } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { ENDPOINTS } from "../api";

export default function Home() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "User";
    const userEmail = localStorage.getItem("userEmail") || "";

    const handleLogout = async () => {
        try {
            await axios.post(ENDPOINTS.LOGOUT, {}, { withCredentials: true });
        } finally {
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="home-container">
            <nav className="home-navbar">
                <div className="nav-left" onClick={() => navigate("/")}>
                    <div className="brand-wrapper">
                        <Sparkles className="brand-icon" size={20} />
                        <span className="brand-name">ATS<span className="brand-accent">Launchpad</span></span>
                    </div>
                </div>

                <div className="nav-actions">
                    <div className="nav-links">
                        <span className="nav-link" onClick={() => navigate("/skill-test")}>Skill Test</span>
                        <span className="nav-link" onClick={() => navigate("/job-fit")}>Job-Fit</span>
                    </div>
                    <div className="user-profile-nav">
                        <div className="profile-circle" aria-hidden="true">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-details">
                            <strong className="profile-name">{userName}</strong>
                            <span className="profile-email">{userEmail}</span>
                        </div>
                        <button className="btn-logout" type="button" onClick={handleLogout} aria-label="Sign out">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            
            <section className="hero">
                <motion.div className="hero-text" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h2>Propel Your Career with <span>ATSLaunchpad</span></h2>
                    <p>
                        The ultimate AI-powered suite: <strong>Analyze</strong> your resume,
                        <strong> Test</strong> your skills, and <strong> Match</strong> with
                        live job openings in seconds.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary" onClick={() => navigate("/upload")}>Get Started</button>
                    </div>
                </motion.div>

                <motion.div className="hero-preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                    <p className="preview-label">Preview</p>
                    <div className="preview-box">Resume Analysis Dashboard</div>
                </motion.div>
            </section>

            <section className="features">
                <h3>What You Can Do?</h3>
                <div className="feature-grid">
                    <Feature icon={<FileText />} title="Resume Analysis" desc="AI-powered resume insights" />
                    <Feature icon={<Target />} title="ATS Score" desc="Get resume ATS score" />
                    <Feature icon={<Target />} title="Job Fit Score" desc="Match resume with job description" />
                    <Feature icon={<Brain />} title="Smart Suggestions" desc="Improve skills & keywords" />
                    <Feature icon={<HelpCircle />} title="Generate MCQs" desc="Test your skills" />
                </div>
            </section>

            <section className="cta">
                <h4>Ready to Land Your Dream Job?</h4>
                <button className="btn-primary" onClick={() => navigate("/upload")}>Get Started</button>
            </section>
        </div>
    );
}

function Feature({ icon, title, desc }) {
    return (
        <div className="feature-card">
            <div className="feature-icon">{icon}</div>
            <h5>{title}</h5>
            <p>{desc}</p>
        </div>
    );
}