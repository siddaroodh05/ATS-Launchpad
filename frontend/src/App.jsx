import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UploadResume from "./pages/UploadResume";
import Analysis from "./pages/Analysis";
import JobFitHome from "./pages/JobFitHome";
import SkillTestHome from "./pages/SkillTestHome";
import QuizPage from "./pages/MCQs";
import ResultsPage from "./pages/ResultsPage";
import JobFitAnalysis from "./pages/JobFitAnalysis";
import Auth from "./pages/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="app-content">
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
            <Route path="/skill-test" element={<ProtectedRoute><SkillTestHome /></ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
            <Route path="/analysis/:id" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
            <Route path="/mcqs" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/skill-test/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            <Route path="/job-fit" element={<ProtectedRoute><JobFitHome /></ProtectedRoute>} />
            <Route path="/job-fit/analysis" element={<ProtectedRoute><JobFitAnalysis /></ProtectedRoute>} />
          </Routes>
        </div>

        <footer className="app-footer">
          &copy; {new Date().getFullYear()} Siddaroodh venkatapur. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("userEmail"));

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default App;
