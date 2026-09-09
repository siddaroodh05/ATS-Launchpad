import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Lightbulb,
  Target,
  ArrowLeft
} from "lucide-react";
import "../styles/JobFitAnalysis.css";

const EMPTY_ANALYSIS = {
  score: 0,
  summary: "",
  matchedSkills: [],
  missingSkills: [],
  skillGaps: [],
  improvements: []
};

export default function JobFitAnalysis() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [analysis, setAnalysis] = useState(() => {
    const initialAnalysis = state?.analysis ?? window.jobFitAnalysisState ?? EMPTY_ANALYSIS;
    return { ...EMPTY_ANALYSIS, ...initialAnalysis };
  });

  useEffect(() => {
    const handleUpdate = (event) => {
      setAnalysis((previous) => ({
        ...EMPTY_ANALYSIS,
        ...previous,
        ...event.detail
      }));
    };

    if (state?.analysis) {
      setAnalysis({ ...EMPTY_ANALYSIS, ...state.analysis });
    }

    window.addEventListener("job-fit-analysis-update", handleUpdate);

    return () => {
      window.removeEventListener("job-fit-analysis-update", handleUpdate);
    };
  }, [state?.analysis]);

  const data = analysis ?? EMPTY_ANALYSIS;
  const isStreaming = data.isStreaming ?? state?.isStreaming ?? false;
  const hasScore = Number(data.score ?? 0) > 0;
  const hasSummary = Boolean((data.summary ?? "").trim());
  const hasSkillTags = Array.isArray(data.matchedSkills) && data.matchedSkills.length > 0;
  const hasMissingSkills = Array.isArray(data.missingSkills) && data.missingSkills.length > 0;
  const hasSkillGaps = Array.isArray(data.skillGaps) && data.skillGaps.length > 0;
  const hasImprovements = Array.isArray(data.improvements) && data.improvements.length > 0;
  const hasAnyData = hasScore || hasSummary || hasSkillTags || hasMissingSkills || hasSkillGaps || hasImprovements;

  if (data.error) {
    return (
      <div className="error-view">
        <h2>Job-fit analysis failed</h2>
        <p>{data.error}</p>
        <button
          className="bottom-btn primary-btn"
          onClick={() => navigate("/job-fit")}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!state?.analysis && !window.jobFitAnalysisState) {
    return (
      <div className="error-view">
        <h2>Oops!</h2>
        <p>There is no job-fit analysis to display.</p>
        <button
          className="bottom-btn primary-btn"
          onClick={() => navigate("/job-fit")}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!isStreaming && !hasAnyData) {
    return (
      <div className="error-view">
        <h2>Analysis not available</h2>
        <p>The job-fit analysis stream did not return any results. Please try again later.</p>
        <button
          className="bottom-btn primary-btn"
          onClick={() => navigate("/job-fit")}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <div className="analysis-container">
        <nav className="analysis-navbar">
          <div className="nav-left" onClick={() => navigate("/job-fit")}>
            <span className="nav-logo">
              <ArrowLeft size={18} /> Back
            </span>
          </div>
          <div className="nav-tabs">
            <span className="nav-tab active">Job-Fit Analysis</span>
          </div>
        </nav>

        <header className="analysis-header">
          <div className="header-info">
            <h1>Analysis Overview</h1>
            <p className="resume-subtitle">
              {isStreaming ? "Live job-fit analysis in progress..." : "Role compatibility review"}
            </p>
          </div>
          {hasScore && (
            <div className="ats-score-badge">
              <span className="score-val">{data.score}</span>
              <span className="score-label">JOB FIT SCORE</span>
            </div>
          )}
        </header>

        {hasSummary && (
          <div className="analysis-summary-card">
            <div className="summary-text">
              <p>{data.summary}</p>
            </div>
          </div>
        )}

        {(hasSkillTags || hasMissingSkills) && (
          <div className="details-grid">
            <section className="details-card">
              <h3>
                <Target size={20} color="#818cf8" /> Matched Skills
              </h3>
              <div className="skills-tags">
                {hasSkillTags && data.matchedSkills.map(skill => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
                {hasMissingSkills && data.missingSkills.map(skill => (
                  <span key={skill} className="skill-tag missing">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {hasSkillGaps && (
              <section className="details-card">
                <h3>
                  <CheckCircle size={20} color="#818cf8" /> Skill Gaps
                </h3>
                <ul className="strength-list">
                  {data.skillGaps.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {hasImprovements && (
          <section className="improvements-card">
            <h3>
              <Lightbulb size={20} color="#fbbf24" /> Recommended Improvements
            </h3>
            <ul className="improvement-list">
              {data.improvements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <footer className="analysis-footer">
          <button
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            Back Home
          </button>
        </footer>
      </div>
    </div>
  );
}
