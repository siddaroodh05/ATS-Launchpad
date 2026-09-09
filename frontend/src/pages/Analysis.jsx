import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Analysis.css";
import { Target, HelpCircle } from "lucide-react";

const EMPTY_ANALYSIS = {
  ats_compatibility_score: 0,
  professional_summary: "",
  strengths: [],
  weaknesses: [],
  improvement_suggestions: []
};

function Analysis() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [analysis, setAnalysis] = useState(() => {
    const initialAnalysis = state?.analysis ?? window.resumeAnalysisState ?? EMPTY_ANALYSIS;
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

    window.addEventListener("resume-analysis-update", handleUpdate);

    return () => {
      window.removeEventListener("resume-analysis-update", handleUpdate);
    };
  }, [state?.analysis]);

  const data = analysis ?? EMPTY_ANALYSIS;
  const isStreaming = data.isStreaming ?? state?.isStreaming ?? false;
  const hasScore = Number(data.ats_compatibility_score ?? 0) > 0;
  const hasSummary = Boolean((data.professional_summary ?? "").trim());
  const hasStrengths = Array.isArray(data.strengths) && data.strengths.length > 0;
  const hasWeaknesses = Array.isArray(data.weaknesses) && data.weaknesses.length > 0;
  const hasRecommendations = Array.isArray(data.improvement_suggestions) && data.improvement_suggestions.length > 0;
  const hasAnyData = hasScore || hasSummary || hasStrengths || hasWeaknesses || hasRecommendations;

  if (data.error) {
    return (
      <div className="error-view">
        <h2>Resume analysis failed</h2>
        <p>{data.error}</p>
        <button
          className="bottom-btn primary-btn"
          onClick={() => navigate("/upload")}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!state?.analysis && !window.resumeAnalysisState) {
    return (
      <div className="error-view">
        <h2>Oops!</h2>
        <p>There is no resume analysis to display.</p>
        <button
          className="bottom-btn primary-btn"
          onClick={() => navigate("/upload")}
        >
          Go Back to Upload
        </button>
      </div>
    );
  }

  if (!isStreaming && !hasAnyData) {
    return (
      <div className="error-view">
        <h2>Analysis not available</h2>
        <p>The analysis stream did not return any results. Please try again later.</p>
        <button
          className="bottom-btn primary-btn"
          onClick={() => navigate("/upload")}
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
          <div className="nav-left">
            <span
              className="nav-logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              ← Home
            </span>
          </div>
          <div className="nav-tabs">
            <span className="nav-tab active">Resume Analysis</span>
          </div>
        </nav>

        <header className="analysis-header">
          <div>
            <h1>Analysis Overview</h1>
            <p className="resume-subtitle">
              {isStreaming ? "Live resume analysis in progress..." : "Resume ATS compatibility review"}
            </p>
          </div>

          {hasScore && (
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {data.ats_compatibility_score}
                </span>
                <span className="stat-label">ATS Score</span>
              </div>
            </div>
          )}
        </header>

        {hasSummary && (
          <section className="resume-preview">
            <div className="resume-right">
              <p className="resume-summary">{data.professional_summary}</p>
            </div>
          </section>
        )}

        <main className="analysis-main">
          {(hasStrengths || hasWeaknesses) && (
            <section className="analysis-grid two-cols">
              {hasStrengths && (
                <article className="analysis-card">
                  <h3>Strengths</h3>
                  <ul className="recommendations-list">
                    {data.strengths.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </article>
              )}

              {hasWeaknesses && (
                <article className="analysis-card">
                  <h3>Weaknesses</h3>
                  <ul className="recommendations-list">
                    {data.weaknesses.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </article>
              )}
            </section>
          )}

          {hasRecommendations && (
            <section className="analysis-grid one-col">
              <article className="analysis-card">
                <h3>Recommended Improvements</h3>
                <ul className="recommendations-list">
                  {data.improvement_suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </article>
            </section>
          )}

          <section className="bottom-buttons">
            <button
              className="bottom-btn primary-btn"
              onClick={() => navigate("/job-fit")}
            >
              <Target size={18} />
              <span>Check Job Fit</span>
            </button>

            <button className="bottom-btn outline-btn" onClick={()=>navigate("/skill-test")}>
              <HelpCircle size={18} />
              <span>Skill Test</span>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Analysis;