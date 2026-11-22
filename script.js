// Screens
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

// Start screen elements
const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("start-btn");
const bestScoreText = document.getElementById("best-score");

// Loading and error elements
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById("error-text");
const tryAgainButton = document.getElementById("try-again-btn");

// Quiz elements
const questionText = document.getElementById("question-text");
const answerContainer = document.getElementById("answer-container");
const progressText = document.getElementById("progress");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const nextButton = document.getElementById("next-btn");

// Results elements
const finalScoreText = document.getElementById("final-score");
const percentageText = document.getElementById("percentage");
const performanceMessage = document.getElementById("performance-message");
const playAgainButton = document.getElementById("play-again-btn");


let quiz = null;
let fetchedQuestions = [];
let questionsLoaded = false;
let isLoading = false;
let timeLeft = 15;
let timerInterval = null;


class Question {
    constructor(question, correctAnswer, incorrectAnswers) {
        this.question = question;
        this.correctAnswer = correctAnswer;

        this.options = this.shuffleAnswers([
            correctAnswer,
            ...incorrectAnswers
        ]);

    }


    // Shuffle answer options using Fisher-Yates
    shuffleAnswers(answers) {
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        return answers;
    }

}

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answered = false;
    }


    // Get current question
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    // Check player's answer
    checkAnswer(answer) {
        if (this.answered) {
            return null;
        }

        this.answered = true;
        const currentQuestion = this.getCurrentQuestion();

        if (answer === currentQuestion.correctAnswer) {
            this.score++;
            return true;
        }
        return false;
    }

    // Mark question as unanswered due to timeout
    markTimedOut() {
        if (this.answered) {
            return;
        }
        this.answered = true;

    }

    // Move to next question
    nextQuestion() {
        this.currentQuestionIndex++;
        this.answered = false;
    }


    // Check whether quiz is finished
    isFinished() {
        return this.currentQuestionIndex >= this.questions.length;
    }

}

function decodeText(text) {
    // First decode URL encoding
    const decoded = decodeURIComponent(text);

    // Then decode HTML entities such as &quot;
    const textarea = document.createElement("textarea");

    textarea.innerHTML = decoded;
    return textarea.value;

}


async function fetchQuestions() {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&encode=url3986`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Network error (${response.status}). Please try again.`
            );
        }

        const data = await response.json();

        // Check API response code
        if (data.response_code !== 0) {
            const errorMessages = {
                1: "Not enough questions available. Try another category or difficulty.",
                2: "Invalid category or difficulty selected.",
                3: "Session token not found.",
                4: "No more questions available in this session.",
                5: "Too many requests. Please wait a few seconds and try again."
            };

            throw new Error(
                errorMessages[data.response_code] ||
                "Unable to retrieve questions. Please try again."
            );

        }

        // Decode questions and answers
        const decodedQuestions = data.results.map(item => ({
            ...item,
            question: decodeText(item.question),
            correct_answer: decodeText(item.correct_answer),
            incorrect_answers: item.incorrect_answers.map(decodeText)

        }));
        return decodedQuestions;

    } catch (error) {
        throw error;

    }

}


function showScreen(screen) {
    startScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    resultsScreen.classList.add("hidden");
    screen.classList.remove("hidden");
}


async function startQuiz() {
    // Prevent duplicate requests
    if (isLoading || questionsLoaded) {
        return;
    }

    isLoading = true;

    // Disable Start button
    startButton.disabled = true;
    startButton.textContent = "Loading...";

    // Show loading message
    loadingMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");

    try {
        // Fetch questions
        fetchedQuestions = await fetchQuestions();

        // Convert API results into Question objects
        const questionObjects = fetchedQuestions.map(item => {

            return new Question(
                item.question,
                item.correct_answer,
                item.incorrect_answers
            );

        });

        // Create new Quiz instance
        quiz = new Quiz(questionObjects);

        // Mark questions as successfully loaded
        questionsLoaded = true;

        // Display quiz screen
        showScreen(quizScreen);

        // Display first question
        displayQuestion();

    } catch (error) {
        // Display friendly erro message
        errorMessage.classList.remove("hidden");
        errorText.textContent = error.message;

    } finally {
        isLoading = false;
        loadingMessage.classList.add("hidden");

        // Allow retry if fetching failed
        if (!questionsLoaded) {
            startButton.disabled = false
            startButton.textContent = "Start Quiz";
        }

    }

}

function displayQuestion() {
    // Clear any previous timer
    stopTimer();
    const currentQuestion = quiz.getCurrentQuestion();

    // Display question text
    questionText.textContent = currentQuestion.question;

    // Display progress
    progressText.textContent =
        `Question ${quiz.currentQuestionIndex + 1} of ${quiz.questions.length}`;

    // Display running score

    scoreText.textContent = `Score: ${quiz.score}`;

    // Clear previous answer buttons

    answerContainer.innerHTML = "";

    // Hide Next button

    nextButton.classList.add("hidden");

    // Create answer buttons dynamically

    currentQuestion.options.forEach(answer => {

        const button = document.createElement("button");

        button.textContent = answer;

        button.type = "button";

        button.classList.add("answer-btn");

        // Handle answer selection

        button.addEventListener("click", () => {

            selectAnswer(answer, button);

        });

        // Add button to answer container

        answerContainer.appendChild(button);

    });

    // Start a fresh timer

    startTimer();

}


/* =====================================
   10. HANDLE ANSWER SELECTION
===================================== */

function selectAnswer(selectedAnswer, selectedButton) {

    // Prevent repeated selection

    if (quiz.answered || selectedButton.disabled) {
        return;
    }

    // Stop timer immediately

    stopTimer();

    const currentQuestion = quiz.getCurrentQuestion();

    // Check answer

    const isCorrect = quiz.checkAnswer(selectedAnswer);

    // Get all answer buttons

    const answerButtons = answerContainer.querySelectorAll("button");

    // Disable every answer button

    answerButtons.forEach(button => {

        button.disabled = true;

    });

    // Correct answer

    if (isCorrect) {

        selectedButton.classList.add("correct");

    } else {

        // Wrong answer

        selectedButton.classList.add("wrong");

        // Reveal correct answer

        answerButtons.forEach(button => {

            if (button.textContent === currentQuestion.correctAnswer) {

                button.classList.add("correct");

            }

        });

    }

    // Update running score
    scoreText.textContent = `Score: ${quiz.score}`;

    // Show Next button

    nextButton.classList.remove("hidden");

}


/* =====================================
   11. TIMER FUNCTIONS
===================================== */

// Stop timer

function stopTimer() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;

    }

}


// Start timer

function startTimer() {

    // Prevent multiple intervals

    stopTimer();

    timeLeft = 15;

    // Reset warning colour

    timerText.classList.remove("warning");

    // Display initial time

    timerText.textContent = `Time: ${timeLeft}s`;

    timerInterval = setInterval(() => {

        timeLeft--;

        timerText.textContent = `Time: ${timeLeft}s`;

        // Warning when 5 seconds or less remain

        if (timeLeft <= 5) {

            timerText.classList.add("warning");

        }

        // Time has expired

        if (timeLeft <= 0) {

            stopTimer();

            handleTimeUp();

        }

    }, 1000);

}


/* =====================================
   12. HANDLE TIME UP
===================================== */

function handleTimeUp() {

    // Prevent timeout from running after an answer

    if (quiz.answered) {
        return;
    }

    // Mark question as unanswered

    quiz.markTimedOut();

    const currentQuestion = quiz.getCurrentQuestion();

    // Get all answer buttons

    const answerButtons = answerContainer.querySelectorAll("button");

    // Disable all buttons

    answerButtons.forEach(button => {

        button.disabled = true;

        // Reveal correct answer

        if (button.textContent === currentQuestion.correctAnswer) {

            button.classList.add("correct");

        }

    });

    // Show Next button

    nextButton.classList.remove("hidden");

}


/* =====================================
   13. NEXT QUESTION
===================================== */

function handleNextQuestion() {

    // Prevent moving forward before answering or timing out

    if (!quiz || !quiz.answered) {
        return;
    }

    // Clear timer

    stopTimer();

    // Move to next question

    quiz.nextQuestion();

    // Check if quiz is finished

    if (quiz.isFinished()) {

        showResults();

    } else {

        displayQuestion();

    }

}


/* =====================================
   14. DISPLAY BEST SCORE
===================================== */

function displayBestScore() {

    const bestScore = Number(
        localStorage.getItem("bestScore")
    ) || 0;

    bestScoreText.textContent = `Best Score: ${bestScore}/10`;

}


/* =====================================
   15. SAVE BEST SCORE
===================================== */

function saveBestScore(score) {

    const currentBestScore = Number(
        localStorage.getItem("bestScore")
    ) || 0;

    // Save only if the new score is higher

    if (score > currentBestScore) {

        localStorage.setItem("bestScore", score);

    }

    // Update displayed best score

    displayBestScore();

}


/* =====================================
   16. RESULTS SCREEN
===================================== */

function showResults() {

    // Stop any running timer

    stopTimer();

    // Get final score

    const finalScore = quiz.score;

    // Calculate percentage

    const percentage = Math.round(
        (finalScore / quiz.questions.length) * 100
    );

    // Display final score

    finalScoreText.textContent =
        `Your Score: ${finalScore}/${quiz.questions.length}`;

    // Display percentage

    percentageText.textContent =
        `Percentage: ${percentage}%`;

    // Performance messages

    if (percentage >= 80) {

        performanceMessage.textContent =
            "Great job! Excellent performance!";

    } else if (percentage >= 60) {

        performanceMessage.textContent =
            "Good effort! Keep improving!";

    } else if (percentage >= 40) {

        performanceMessage.textContent =
            "Not bad! You can do better!";

    } else {

        performanceMessage.textContent =
            "Keep practising. You'll improve!";

    }

    // Save best score

    saveBestScore(finalScore);

    // Show results screen

    showScreen(resultsScreen);

}


/* =====================================
   17. PLAY AGAIN
===================================== */

function playAgain() {

    // Stop any running timer

    stopTimer();

    // Reset quiz data

    quiz = null;

    fetchedQuestions = [];

    questionsLoaded = false;

    isLoading = false;

    // Reset timer

    timeLeft = 15;

    timerText.textContent = "Time: 15s";

    timerText.classList.remove("warning");

    // Clear previous question and answers

    questionText.textContent = "";

    answerContainer.innerHTML = "";

    // Reset score and progress

    scoreText.textContent = "Score: 0";

    progressText.textContent = "Question 1 of 10";

    // Hide Next button

    nextButton.classList.add("hidden");

    // Restore Start button

    startButton.disabled = false;

    startButton.textContent = "Start Quiz";

    // Hide loading and error messages

    loadingMessage.classList.add("hidden");

    errorMessage.classList.add("hidden");

    // Update best score

    displayBestScore();

    // Return to Start screen

    showScreen(startScreen);

}


/* =====================================
   18. EVENT LISTENERS
===================================== */

// Start Quiz

startButton.addEventListener("click", startQuiz);

// Try Again

tryAgainButton.addEventListener("click", startQuiz);

// Next Question

nextButton.addEventListener("click", handleNextQuestion);

// Play Again

playAgainButton.addEventListener("click", playAgain);


/* =====================================
   19. INITIALIZE APPLICATION
===================================== */

// Display saved best score

displayBestScore();

// Show Start screen

showScreen(startScreen);
