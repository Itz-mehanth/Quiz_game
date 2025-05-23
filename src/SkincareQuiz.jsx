import React, { useState, useEffect, useRef } from "react";
import startSound from "./sounds/start.mp3";
import countdownSound from "./sounds/countdown.wav";
import correctSound from "./sounds/correct.wav";
import wrongSound from "./sounds/wrong.wav";
import endSound from "./sounds/end.wav";

const questions = [
  {
    question: "What is the primary function of sunscreen?",
    options: ["Moisturize skin", "Protect from UV rays", "Brighten complexion", "Reduce acne"],
    answer: "Protect from UV rays",
  },
  {
    question: "Which vitamin is best known for skin healing?",
    options: ["Vitamin C", "Vitamin A", "Vitamin E", "Vitamin K"],
    answer: "Vitamin E",
  },
  {
    question: "How often should you exfoliate your skin?",
    options: ["Daily", "Once a week", "Twice a day", "Never"],
    answer: "Once a week",
  },
  {
    question: "Which ingredient is commonly used to treat acne?",
    options: ["Hyaluronic Acid", "Salicylic Acid", "Collagen", "Retinol"],
    answer: "Salicylic Acid",
  },
  {
    question: "What is the ideal pH level for healthy skin?",
    options: ["2-3", "4.5-5.5", "6-7", "8-9"],
    answer: "4.5-5.5",
  },
  {
    question: "Which skincare product is best for deep hydration?",
    options: ["Toner", "Serum", "Moisturizer", "Face Scrub"],
    answer: "Serum",
  },
  {
    question: "What does retinol help with?",
    options: ["Sun protection", "Wrinkle reduction", "Oil control", "Skin hydration"],
    answer: "Wrinkle reduction",
  },
  {
    question: "Which natural ingredient is known for brightening the skin?",
    options: ["Aloe Vera", "Turmeric", "Tea Tree Oil", "Charcoal"],
    answer: "Turmeric",
  },
  {
    question: "Which skin type is most prone to acne?",
    options: ["Oily", "Dry", "Normal", "Combination"],
    answer: "Oily",
  },
  {
    question: "Which step should come first in a skincare routine?",
    options: ["Moisturizer", "Toner", "Cleanser", "Sunscreen"],
    answer: "Cleanser",
  },
  {
    question: "What does SPF in sunscreen stand for?",
    options: ["Skin Protection Factor", "Sun Protection Factor", "Solar Protection Formula", "Safe Protection Formula"],
    answer: "Sun Protection Factor",
  },
  {
    question: "Which ingredient is best for reducing dark circles?",
    options: ["Vitamin C", "Caffeine", "Glycolic Acid", "Salicylic Acid"],
    answer: "Caffeine",
  },
  {
    question: "How much water should you drink daily for healthy skin?",
    options: ["1-2 glasses", "3-4 glasses", "6-8 glasses", "10+ glasses"],
    answer: "6-8 glasses",
  },
];

const SkincareQuiz = () => {
  const [loading, setLoading] = useState(true); // splash screen
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizTimer, setQuizTimer] = useState(90);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [coins, setCoins] = useState(0);
  const [musicOn, setMusicOn] = useState(false);

  const musicRef = useRef(new Audio(startSound));
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const endRef = useRef(null);
  const countdownRef = useRef(null);

  // Preload sounds and show splash screen
  useEffect(() => {
    const correct = new Audio(correctSound);
    const wrong = new Audio(wrongSound);
    const end = new Audio(endSound);
    const countdown = new Audio(countdownSound);

    correct.volume = 0;
    wrong.volume = 0;
    end.volume = 0;
    countdown.volume = 0;

    Promise.all([
      correct.play().catch(() => {}),
      wrong.play().catch(() => {}),
      end.play().catch(() => {}),
      countdown.play().catch(() => {}),
    ]).then(() => {
      correct.pause(); wrong.pause(); end.pause(); countdown.pause();
      correct.currentTime = 0; wrong.currentTime = 0; end.currentTime = 0; countdown.currentTime = 0;
      correct.volume = 1; wrong.volume = 1; end.volume = 1; countdown.volume = 1;
      correctRef.current = correct;
      wrongRef.current = wrong;
      endRef.current = end;
      countdownRef.current = countdown;

      // Play background music during splash screen
      musicRef.current.volume = 0.6;
      musicRef.current.loop = true;
      musicRef.current.play().catch(() => {});

      setTimeout(() => {
        setLoading(false);
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }, 2500); // splash duration
    });
  }, []);

  // Background music control
  useEffect(() => {
    musicRef.current.loop = true;
    if (musicOn) {
      musicRef.current.play().catch(() => {});
    } else {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  }, [musicOn]);

  // Countdown before quiz starts
  useEffect(() => {
    if (gameStarted && countdown > 0) {
      countdownRef.current.play();
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setQuizTimer(90);
    }
  }, [gameStarted, countdown]);

  // Quiz timer
  useEffect(() => {
    if (countdown === 0 && !showScore && quizTimer > 0) {
      const timer = setInterval(() => {
        setQuizTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowScore(true);
            endRef.current.play();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, showScore]);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const isCorrect = option === questions[currentQuestion].answer;

    if (isCorrect) {
      correctRef.current.play();
      setCoins(coins + Math.floor(999 / (currentQuestion + 1)));
      setScore(score + 1);
      setMessage("Correct!");
    } else {
      wrongRef.current.play();
      setMessage("Wrong!");
    }

    setTimeout(() => {
      setMessage("");
      setSelectedOption(null);
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowScore(true);
        endRef.current.play();
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setGameStarted(false);
    setCountdown(3);
    setCurrentQuestion(0);
    setScore(0);
    setCoins(0);
    setShowScore(false);
    setQuizTimer(90);
  };

  // Splash screen while loading
  if (loading) {
    return (
      <div className="splash-screen">
        <h1>🌿 Welcome to the Skincare Quiz 🌟</h1>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {!gameStarted ? (
        <div className="home-screen">
          <h1>Skincare Quiz</h1>
          <button className="start-button" onClick={() => setGameStarted(true)}>Start Game</button>
          <button className="music-toggle" onClick={() => setMusicOn(!musicOn)}>
            {musicOn ? "Music Off" : "Music On"}
          </button>
        </div>
      ) : countdown > 0 ? (
        <div className="countdown">{countdown}</div>
      ) : showScore ? (
        <div className="results-screen">
          <h2 className="quiz-completed">Quiz Completed!</h2>
          <table className="results-table">
            <tbody>
              <tr><td>Score:</td> <td>{score} / {questions.length}</td></tr>
              <tr><td>Coins:</td> <td>{coins} 💰</td></tr>
              <tr><td>Time Left:</td> <td>{quizTimer}s ⏳</td></tr>
            </tbody>
          </table>
          <div className="coupon">
            Coupon Code: <span className="coupon-code">SKIN100</span>
            <button className="copy-button" onClick={() => navigator.clipboard.writeText("SKIN100")}>
              📋
            </button>
          </div>
          <button className="restart-button" onClick={restartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        <div className="quiz-card">
          <div className="circular-timer">
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" stroke="#ff4757" strokeWidth="5" fill="none" />
              <circle 
                cx="30" cy="30" r="25" 
                stroke="#2ed573" strokeWidth="5" fill="none"
                strokeDasharray="157"
                strokeDashoffset={(quizTimer / 90) * 157}
                transform="rotate(-90 30 30)"
              />
            </svg>
          </div>

          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} 
            />
          </div>

          <h2>{questions[currentQuestion].question}</h2>
          <div className="quiz-options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`quiz-button ${
                  selectedOption
                    ? option === questions[currentQuestion].answer
                      ? "correct"
                      : option === selectedOption
                      ? "wrong"
                      : "hidden"
                    : ""
                }`}
                onClick={() => handleAnswer(option)}
                disabled={selectedOption !== null}
              >
                <span className="option-label">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
          {message && (
            <div className={`message ${message === "Correct!" ? "correct-message" : "wrong-message"}`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkincareQuiz;
