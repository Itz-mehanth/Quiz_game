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
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizTimer, setQuizTimer] = useState(30);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [coins, setCoins] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const musicRef = useRef(new Audio(startSound));

  useEffect(() => {
    musicRef.current.loop = true;
    if (musicOn) {
      musicRef.current.play().catch(() => {});
    } else {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  }, [musicOn]);

  useEffect(() => {
    if (gameStarted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setQuizTimer(30); // Start quiz timer after countdown
    }
  }, [gameStarted, countdown]);

  useEffect(() => {
    if (countdown === 0 && !showScore && quizTimer > 0) {
      const timer = setInterval(() => {
        setQuizTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowScore(true);
            new Audio(endSound).play();
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
    if (option === questions[currentQuestion].answer) {
      new Audio(correctSound).play();
      setCoins(coins + Math.floor(999 / (currentQuestion + 1)));
      setScore(score + 1);
      setMessage("Correct!");
    } else {
      new Audio(wrongSound).play();
      setMessage("Wrong!");
    }
    setTimeout(() => {
      setMessage("");
      setSelectedOption(null);
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowScore(true);
        new Audio(endSound).play();
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
    setQuizTimer(30); // Corrected reset for quiz timer
  };

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
          <h2 >Quiz Completed!</h2>
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
          {/* Circular Timer */}
          <div className="circular-timer">
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" stroke="#ff4757" strokeWidth="5" fill="none" />
              <circle 
                cx="30" cy="30" r="25" 
                stroke="#2ed573" strokeWidth="5" fill="none"
                strokeDasharray="157"
                strokeDashoffset={(quizTimer / 30) * 157}
                transform="rotate(-90 30 30)"
              />
            </svg>
          </div>

            {/* <span className="timer-text">Time Left: {quizTimer}s</span> */}
          {/* Progress Bar */}
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
          {message && <div className={`message ${message === "Correct!" ? "correct-message" : "wrong-message"}`}>{message}</div>}
        </div>
      )}
    </div>
  );
};

export default SkincareQuiz;
