# Quiz App

A responsive, interactive quiz application built with HTML, CSS, and Vanilla JavaScript. The application retrieves multiple-choice questions from the Open Trivia Database (OpenTDB), allows users to answer questions within a 15-second countdown, and displays their final performance at the end of each game.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [How the Application Works](#how-the-application-works)
- [API Integration](#api-integration)
- [JavaScript Implementation](#javascript-implementation)
- [Data Persistence](#data-persistence)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Future Improvements](#future-improvements)
- [Acknowledgements](#acknowledgements)

## Project Overview

The Quiz App is an interactive web application developed as an individual JavaScript project.

It allows users to select a question category and difficulty level before starting a quiz containing 10 multiple-choice questions.

Each question has a 15-second time limit. Users receive immediate feedback after selecting an answer, while the application automatically reveals the correct answer when the timer expires.

At the end of the quiz, users can view their final score, percentage, and performance feedback. The application also stores their highest score using the browser's local storage.

## Features

- **Category Selection:** Choose from General Knowledge, Science & Nature, Computers, Sports, and History.
- **Difficulty Selection:** Select Easy, Medium, or Hard questions.
- **Dynamic Questions:** Retrieve 10 questions from the Open Trivia Database API.
- **Randomized Answers:** Shuffle answer options using the Fisher-Yates algorithm.
- **Countdown Timer:** Allow 15 seconds to answer each question.
- **Instant Feedback:** Highlight correct answers in green and incorrect answers in red.
- **Automatic Timeout:** Reveal the correct answer when the countdown reaches zero.
- **Progress Tracking:** Display the current question number and running score.
- **Results Screen:** Display the final score, percentage, and performance message.
- **Best Score Tracking:** Save the highest score using browser localStorage.
- **Error Handling:** Display friendly error messages when questions cannot be retrieved, with an option to retry.
- **Responsive Design:** Support desktop and mobile screen sizes.

## Technologies Used

| Technology         | Purpose                                                                        |
| ------------------ | ------------------------------------------------------------------------------ |
| HTML5              | Structures the application and its three screens.                              |
| CSS3               | Handles styling, layout, button states, and responsive design.                 |
| JavaScript (ES6+)  | Implements quiz logic, classes, event handling, and application functionality. |
| Open Trivia DB API | Provides the multiple-choice questions.                                        |
| localStorage       | Stores the player's best score in the browser.                                 |

No JavaScript frameworks or external libraries are used.

## Project Structure

The project is organized into four main files:

```text
quiz-app/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

**File descriptions:**

- `index.html`: Contains the application structure, including the Start, Quiz, and Results screens.
- `style.css`: Defines the visual appearance, layout, answer states, and responsive styling.
- `script.js`: Contains the application logic, API integration, question management, timer, scoring, and event listeners.
- `README.md`: Provides project documentation and instructions for running the application.

## How the Application Works

The application follows a simple sequence:

1. The user opens the application and selects a question category and difficulty.
2. The user clicks the Start Quiz button.
3. JavaScript sends a request to Open Trivia DB to retrieve 10 questions.
4. The API response is processed and converted into Question objects.
5. The Quiz class manages the questions, current question index, and score.
6. Each question is displayed with four randomized answer options.
7. A 15-second countdown starts for each question.
8. When an answer is selected, the application checks it, updates the score, and displays feedback.
9. If the timer expires, the correct answer is revealed without awarding a point.
10. After all 10 questions, the Results screen displays the final score and percentage.
11. The highest score is saved in localStorage.

## API Integration

The application uses the [Open Trivia Database API](https://opentdb.com/api_config.php) to retrieve quiz questions.

The API request is configured to retrieve:

- 10 questions per game.
- The category selected by the user.
- The selected difficulty level.
- Multiple-choice questions.
- URL-encoded response data using the URL3986 encoding option.

The JavaScript `fetch()` function retrieves the data asynchronously using `async/await`.

Before processing the response, the application checks:

- Whether the HTTP request was successful using `response.ok`.
- Whether the API returned a successful response using `response_code`.

The application also handles API errors and displays appropriate messages when questions cannot be retrieved.

The returned question text and answers are decoded before being displayed to the user.

**API documentation:** https://opentdb.com/api_config.php

## JavaScript Implementation

The application uses JavaScript classes, functions, array methods, and browser APIs to manage its functionality.

### 1. Question Class

The `Question` class represents an individual quiz question.

It stores:

- The question text.
- The correct answer.
- The available answer options.

It also includes a method that randomizes answer options using the Fisher-Yates shuffle algorithm.

### 2. Quiz Class

The `Quiz` class manages the overall quiz session.

It maintains:

- The collection of questions.
- The current question index.
- The player's score.
- Whether the current question has been answered.

Its methods handle retrieving the current question, checking answers, recording timeouts, moving to the next question, and determining when the quiz has finished.

### 3. Asynchronous JavaScript

The application uses `async/await` and `fetch()` to retrieve questions from the external API without blocking the browser interface.

It also manages loading states, prevents duplicate requests, and handles unsuccessful API responses.

### 4. DOM Manipulation

JavaScript dynamically creates answer buttons for each question using `document.createElement()`.

Event listeners are attached to these buttons to process the player's selections and update the interface.

### 5. Timer Management

The application uses `setInterval()` to implement the 15-second countdown.

`clearInterval()` stops the countdown when the user answers or when the time expires, preventing multiple timers from running simultaneously.

### 6. Array Methods

The application uses JavaScript array methods, including:

- `map()` to transform API question data into Question objects.
- `forEach()` to generate answer buttons and process answer selections.

## Data Persistence

The application uses the browser's `localStorage` API to preserve the player's best score between sessions.

When a quiz is completed, the application compares the latest score with the previously stored best score.

Only a higher score replaces the existing record.

The stored value remains available when the browser is refreshed or the application is reopened on the same browser and origin.

## Getting Started

### Prerequisites

To run this project, you need:

- A modern web browser such as Google Chrome, Firefox, or Microsoft Edge.
- A code editor such as Visual Studio Code.
- An active internet connection to retrieve questions from Open Trivia DB.

### Installation

1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Ensure that `index.html`, `style.css`, and `script.js` are in the same directory.
4. Confirm that the HTML file correctly links to the CSS and JavaScript files.

## Running the Application

The application does not require a package manager, build process, or framework installation.

You can open `index.html` directly in your browser or use the Live Server extension in Visual Studio Code.

To use Live Server:

1. Open Visual Studio Code.
2. Install the Live Server extension if it is not already installed.
3. Open `index.html`.
4. Right-click inside the file.
5. Select **Open with Live Server**.

The application should open in your default browser.

## Future Improvements

With additional development time, the following features could be introduced:

- A True/False question mode.
- A leaderboard showing the top five scores.
- A question review screen showing selected and correct answers.
- Sound effects and additional feedback animations.
- A points bonus for answering questions quickly.
- Additional question categories and improved category selection.

## Acknowledgements

- [Open Trivia Database](https://opentdb.com/) for providing the quiz questions.
- [MDN Web Docs](https://developer.mozilla.org/) for JavaScript, HTML, and CSS documentation.

---

**Project:** Quiz App  
**Development:** Individual Project  
**Technologies:** HTML5, CSS3, and Vanilla JavaScript
