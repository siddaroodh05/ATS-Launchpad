import "../styles/Mcq.css";
import { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock, ChevronRight, ChevronLeft, CheckCircle, Loader2 } from "lucide-react";

export default function QuizPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const questions = state?.questions || [];
  const unavailable = state?.unavailable || false;
  const error = state?.error;
  const answerByQuestion = Object.fromEntries(
    (state?.answers || []).map((answer) => [answer.questionNumber, answer])
  );

  const [questionss] = useState(questions);
  const [loading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionSelect = (option) => {
    const questionNumber = questionss[currentQuestion].questionNumber;
    setSelectedAnswers({ ...selectedAnswers, [questionNumber]: option });
  };

  const handleSubmit = useCallback(() => {
    let score = 0;

    const formattedQuestions = questionss.map((q) => {
      const answer = answerByQuestion[q.questionNumber];
      const userAnswer = selectedAnswers[q.questionNumber] || "Skipped";
      const correctAnswer = answer?.correctAnswer || "Unavailable";
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) score += 1;

      return {
        questionText: q.question,
        options: q.options,
        userAnswer,
        correctAnswer,
        explanation: answer?.explanation || ""
      };
    });

    const timeSpentSeconds = 900 - timeLeft;
    const minutesTaken = Math.floor(timeSpentSeconds / 60);
    const secondsTaken = timeSpentSeconds % 60;
    const timeFormatted = `${minutesTaken}:${secondsTaken < 10 ? "0" : ""}${secondsTaken}`;

    const percentage = questionss.length
      ? (score / questionss.length) * 100
      : 0;
    const status = percentage < 50
      ? "Fail"
      : percentage >= 80
        ? "Excellent"
        : "Pass";

    navigate("/skill-test/results", { 
      state: { 
        results: {
          score,
          total: questionss.length,
          status,
          percentage,
          timeTaken: timeFormatted,
          questionss: formattedQuestions
        } 
      } 
    });
  }, [answerByQuestion, navigate, questionss, selectedAnswers, timeLeft]);

  useEffect(() => {
    if (error || unavailable || !questionss.length || !Object.keys(answerByQuestion).length) {
      return undefined;
    }

    if (timeLeft === 0) {
      handleSubmit();
      return undefined;
    }

    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [answerByQuestion, error, handleSubmit, questionss.length, timeLeft, unavailable]);

  if (error) {
    return (
      <div className="loading-container">
        <p>{error}</p>
        <button className="submit-btn" onClick={() => navigate("/skill-test")}>
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading questions...</p>
      </div>
    );
  }

  if (unavailable || !questionss.length || !Object.keys(answerByQuestion).length) {
    return (
      <div className="loading-container">
        <p>Unable to take the skill test right now. Please try again later.</p>
        <button className="submit-btn" onClick={() => navigate("/skill-test")}>
          Back to Skill Test
        </button>
      </div>
    );
  }

  const currentData = questionss[currentQuestion];

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <header className="quiz-header">
          <div className="quiz-info">
            <span className="question-count">
              Question <strong>{currentQuestion + 1}</strong> of {questionss.length}
            </span>
            <div className="timer">
              <Clock size={18} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questionss.length) * 100}%` }}
            ></div>
          </div>
        </header>

        <main className="question-card">
          <h2 className="question-text">{currentData.question}</h2>
          <div className="options-grid">
            {currentData.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswers[currentData.questionNumber] === option ? "selected" : ""}`}
                onClick={() => handleOptionSelect(option)}
              >
                <span className="option-label">{String.fromCharCode(65 + index)}</span>
                <span className="option-value">{option}</span>
              </button>
            ))}
          </div>
        </main>

        <footer className="quiz-footer">
          <button 
            className="nav-btn prev" 
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            <ChevronLeft size={20} /> Previous
          </button>

          <div className="footer-actions">
            {currentQuestion === questionss.length - 1 ? (
              <button className="submit-btn" onClick={handleSubmit}>
                <CheckCircle size={18} /> Finish Test
              </button>
            ) : (
              <button 
                className="nav-btn next" 
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                Next <ChevronRight size={20} />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
