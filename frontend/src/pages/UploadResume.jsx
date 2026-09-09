import { useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/UploadResume.css";
import { ENDPOINTS, streamMultipart } from "../api";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a resume");

    try {
      setIsAnalyzing(true);
      const analysis = {
        ats_compatibility_score: 0,
        professional_summary: "",
        strengths: [],
        weaknesses: [],
        improvement_suggestions: []
      };

      const syncAnalysis = (updatedAnalysis) => {
        window.resumeAnalysisState = updatedAnalysis;
        window.dispatchEvent(
          new CustomEvent("resume-analysis-update", { detail: updatedAnalysis })
        );
      };

      syncAnalysis(analysis);
      navigate("/analysis", { state: { analysis, isStreaming: true } });

      await streamMultipart(ENDPOINTS.ANALYZE_RESUME, { file }, (event, data) => {
        if (event === "ats_score") analysis.ats_compatibility_score = Number(data.score ?? 0);
        if (event === "summary") analysis.professional_summary = data.text || "";
        if (event === "strengths") analysis.strengths = data.items || [];
        if (event === "weaknesses") analysis.weaknesses = data.items || [];
        if (event === "recommendations") analysis.improvement_suggestions = data.items || [];

        syncAnalysis({ ...analysis });
      }, {
        requiredEvents: ["ats_score", "summary", "strengths", "weaknesses", "recommendations", "complete"],
        errorFallback: "Resume analysis failed."
      });

      syncAnalysis({ ...analysis, isStreaming: false });
    } catch (error) {
      console.error("Analysis failed:", error);
      const message = error.message || "An error occurred during resume analysis.";
      const failedAnalysis = {
        ...(window.resumeAnalysisState || {}),
        isStreaming: false,
        error: message
      };
      window.resumeAnalysisState = failedAnalysis;
      window.dispatchEvent(
        new CustomEvent("resume-analysis-update", { detail: failedAnalysis })
      );
      navigate("/analysis", { state: { analysis: failedAnalysis, isStreaming: false } });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="upload-page">
      <div
        className="upload-card"
      >
        <div className="upload-icon">
          <UploadCloud size={42} />
        </div>
        <h2>Upload Your Resume</h2>
        
        <label className={`upload-box ${file ? "has-file" : ""}`}>
          <input 
            type="file" 
              accept=".pdf,.doc,.docx" 
            onChange={handleFileChange} 
            hidden 
          />
          {!file ? (
            <div className="upload-placeholder">
              <FileText size={36} />
              <span>Click to upload PDF</span>
            </div>
          ) : (
            <div className="file-preview">
              <FileText size={28} />
              <span>{file.name}</span>
            </div>
          )}
        </label>

        <button 
          className="analyze-btn" 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !file}
        >
          {isAnalyzing ? (
            <span className="flex-center">
              <Loader2 className="spinner-icon rotate" size={20} /> 
              Analyzing...
            </span>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </div>
    </div>
  );
}
