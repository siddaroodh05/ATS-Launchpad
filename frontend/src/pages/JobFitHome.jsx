import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Briefcase,
  Zap,
  ShieldCheck,
  Info,
  Loader2,
  ArrowLeft
} from "lucide-react";
import "../styles/JobfitHome.css";
import { ENDPOINTS, streamMultipart } from "../api";

export default function JobFitHome() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const analyzeJobFit = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Please provide both a job description and a resume.");
      return;
    }

    try {
      setIsAnalyzing(true);
      const analysis = {
        score: 0,
        summary: "",
        matchedSkills: [],
        missingSkills: [],
        skillGaps: [],
        improvements: []
      };

      const syncAnalysis = (updatedAnalysis) => {
        window.jobFitAnalysisState = updatedAnalysis;
        window.dispatchEvent(
          new CustomEvent("job-fit-analysis-update", { detail: updatedAnalysis })
        );
      };

      syncAnalysis(analysis);
      navigate("/job-fit/analysis", { state: { analysis, isStreaming: true } });

      await streamMultipart(
        ENDPOINTS.ANALYZE_JOB_FIT,
        {
          file,
          jobDescription: new Blob(
            [JSON.stringify({ description: jobDescription })],
            { type: "application/json" }
          )
        },
        (event, data) => {
          if (event === "match_score") analysis.score = Number(data.score ?? 0);
          if (event === "summary") analysis.summary = data.text || "";
          if (event === "matched_skills") analysis.matchedSkills = data.items || [];
          if (event === "missing_skills") analysis.missingSkills = data.items || [];
          if (event === "skill_gaps") analysis.skillGaps = data.items || [];
          if (event === "recommendations") analysis.improvements = data.items || [];

          syncAnalysis({ ...analysis });
        },
        {
          requiredEvents: ["match_score", "summary", "matched_skills", "missing_skills", "skill_gaps", "recommendations", "complete"],
          errorFallback: "Job-fit analysis failed."
        }
      );

      syncAnalysis({ ...analysis, isStreaming: false });
    } catch (error) {
      console.error("Analysis failed:", error);
      const message = error.message || "An error occurred during job-fit analysis.";
      const failedAnalysis = {
        ...(window.jobFitAnalysisState || {}),
        isStreaming: false,
        error: message
      };
      window.jobFitAnalysisState = failedAnalysis;
      window.dispatchEvent(
        new CustomEvent("job-fit-analysis-update", { detail: failedAnalysis })
      );
      navigate("/job-fit/analysis", { state: { analysis: failedAnalysis, isStreaming: false } });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="job-fit-page">
      <div className="job-fit-container">
        <nav className="analysis-navbar">
          <div className="nav-left" onClick={() => navigate("/")}>
            <span className="nav-logo">
              <ArrowLeft size={18} /> Home
            </span>
          </div>
          <div className="nav-tabs">
            <span className="nav-tab active">Job-Fit Analysis</span>
          </div>
        </nav>

        <div className="job-fit-content">
          <header className="job-header">
            <h1>
              Check Your <span>Job-Fit</span>
            </h1>
            <p>
              Paste a job description to see how well your profile aligns with
              the role requirements.
            </p>
          </header>

          <div className="job-grid">
            <div className="input-section">
              <div className="card-header">
                <Briefcase className="header-icon" size={24} />
                <h3>Job Details</h3>
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  placeholder="Paste the job requirements, responsibilities, and qualifications here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Your Resume</label>
                <label
                  className={`job-upload-zone ${
                    file ? "has-file" : ""
                  }`}
                >
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <Upload size={24} />
                  <span>
                    {file ? file.name : "Upload Resume (PDF/DOCX)"}
                  </span>
                </label>
              </div>

              <button
                className="analyze-btn"
                onClick={analyzeJobFit}
                disabled={isAnalyzing || !file || !jobDescription.trim()}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing...
                  </span>
                ) : (
                  "Calculate Fit Score"
                )}
              </button>
            </div>

            <div className="info-section">
              <div className="card-header">
                <Info className="header-icon" size={24} />
                <h3>How it Works</h3>
              </div>

              <div className="instruction-steps">
                <div className="step">
                  <div className="step-icon">
                    <Zap size={20} />
                  </div>
                  <div className="step-text">
                    <strong>Keyword Extraction</strong>
                    <p>
                      Our AI identifies mandatory skills and nice-to-have
                      qualifications from the JD.
                    </p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="step-text">
                    <strong>Gap Analysis</strong>
                    <p>
                      We compare your resume against the JD to find missing
                      keywords and experience gaps.
                    </p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-icon">
                    <Briefcase size={20} />
                  </div>
                  <div className="step-text">
                    <strong>Compatibility Score</strong>
                    <p>
                      Receive a percentage score and actionable tips to improve
                      your resume.
                    </p>
                  </div>
                </div>
              </div>

              <div className="tip-box">
                <p>
                  <strong>Pro Tip:</strong> Include a clear “Skills” or
                  “Requirements” section in the JD for best results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
