// variables below are storing references to various elements in the html
let startBtn = document.getElementById("start-btn");
let questionContainer = document.getElementById("question-container");
let choicesContainer = document.getElementById("choices-container");
let timerElement = document.getElementById("timer");
let scoreForm = document.getElementById("score-form");
let seescores = document.getElementById("see-scores");
// question index keeps track of the current question being displayed
var questionIndex = 0;
// timer is a variable that stores the interval ID for the timer
let timer;
// timeRemaining gives the user a minute to finish the quiz where the remaining time is used to determine a score
let timeRemaining = 60;

// is an array that contains all of the questions for the quiz
let quizQuestions = [
  "What does HTML stand for?",
  "How can you select an element with the ID 'header' in CSS?",
  "Which keyword is used to declare a variable in JavaScript?",
  "What is the purpose of the <li> tag in HTML?",
  "How can you add comments in a CSS file?",
];

// the array choice contians both the options that will be listed under the question for the quiz, as well as the answer
// the option property contains a string with the options; the answer property contains a string containing the correct
// solution to the corresponding question
let choices = [
  {
    option:
      "A) Hyper Text Markup Language, B) High Tech Madeup Language, C) Hyper Translational Module Language, D) Hella Technical Modern Language",
    answer: "A) Hyper Text Markup Language",
  },
  {
    option: "A) %header, B) @header, C) .header, D) #header",
    answer: " D) #header",
  },
  {
    option: "A) v, B) var, C) variable, D) declare",
    answer: " B) var",
  },
  {
    option:
      "A) To integrate linearly, B) To include footnote for legal issues, C) To create a listed item, D) To minimize electrical consumptionfor low income users ",
    answer: " C) To create a listed item",
  },
  {
    option:
      "A) <!-- This is a comment -->, B) // This is a comment, C) /* This is a comment */, D) 'This is a comment'",
    answer: " C) /* This is a comment */",
  },
];

// the startquiz function allows for certain components to be hidden upon startup and other to become visible
function startquiz() {
  // hides the quiz until start quiz button is clicked
  startBtn.style.display = "none";
  // anything that is set to "flex" below is visible and anything set to "none" is not visible
  questionContainer.style.display = "flex";
  choicesContainer.style.display = "flex";
  timerElement.style.display = "flex";
  seescores.style.display = "none";
  //displays the first question and calls displayquestion function
  displayQuestion(questionIndex);
  // updateTimer function starts the timer 
  updateTimer();
  // gets the stored time from the local storage and assigns it to the variable storedTime
  const storedtime = localStorage.getItem('remainingTime');

}

// this function dynamically updates the content of the HTML elements (questionContainer and choicesContainer) 
// based on the current question index. It clears the previous choices, creates new HTML elements for each choice,
// and sets up click event listeners for each choice to handle user interactions during the quiz.
function displayQuestion(questionIndex) {
  // Display a question and its choices
  questionContainer.textContent = quizQuestions[questionIndex];
  // below clears any existing content inside the choicescontainer
  choicesContainer.innerHTML = "";
  // splits the options for the current question at question index into an array using the comma as the point of 
  // separation
  choices[questionIndex].option.split(",").forEach((choice) => {
    // below will create a new div element
    let choiceElement = document.createElement("div");
    // sets the class of the choice element to choiceElement
    choiceElement.setAttribute("class", "choiceElement");
    // sets the textcontent of the choice element to the current chouce
    choiceElement.textContent = choice;
    // when the choice is clicked it calls the checkAnswer function with the selected choice and the current question
    // index
    choiceElement.addEventListener("click", () =>
      checkAnswer(choice, questionIndex)
    );
    // adds the choiceElement to the choices container
    choicesContainer.appendChild(choiceElement);
    // console.log is for me to verify the behavior is as I expect in the console
    console.log(choiceElement);
  });
}

function checkAnswer(userAnswer, questionIndex) {
  // Check if the user's answer is correct
  
  if (userAnswer !== choices[questionIndex].answer) {
    // if the user's answer is not equal to the answer property in the choices object in the corresponding questionindex
    // then it is logged as incorrect in the console
    console.log("incorrect");
    // then 10 seconds are deducted from the timeRemaining variable
    timeRemaining = timeRemaining - 10;
  } else {
    // otherwise it is marked as correct in the console
    console.log("correct");
  }
  // regardless of whether or not the answer is correct or incorrect the function will will check if there are more 
  //questions 
  if (questionIndex < quizQuestions.length - 1) {
    // if there are still more questions the function displayQuestion is called
    displayQuestion(questionIndex + 1);
  } else {
    // otherwise the quiz will end
    endQuiz();
  }
}

function updateTimer() {
  // Update the timer every second
  timer = setInterval(function () {
    // decrements the timeRemaining by 1
    timeRemaining--;
    // updates the text content of the timerElement to display the remaining time in the format Time: X seconds
    //x being the current time
    timerElement.textContent = "Time: " + timeRemaining + " seconds";
    // below is used so that the grammar is correct; when the time is equivalent to one singular second, the string suffix
    // changes to second instead of seconds
    if (timeRemaining === 1) {
      timerElement.textContent = "Time: " + timeRemaining + " second";
    }
    // included below so that the score would never be a negative value because that's just embarrassing
    // once the timeremaining hits 0, the function end quiz is called
    if (timeRemaining <= 0) {
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  // Handle the end of the quiz by stopping the timer by clearing the interval that was set by setInterval
  clearInterval(timer); 
  // sets the text content of the element with the ID question-container to the string "Quiz Over!"
  questionContainer.textContent = "Quiz Over!";
  // clears the choices container element; removes the choices that were being displayed in the quiz
  choicesContainer.innerHTML = "";
  scoreForm.style.display = "block"; // Show the score form
}

// when the start quiz button is clicked it will invoke the start quiz function
startBtn.addEventListener("click", startquiz);
// when the see scores button is clicked it will invoke the displayScores function
seescores.addEventListener("click", displayScores);

// Event listener for score submission
// an unnamed function will be executed when the submit event occurs; the event parameter represents the event
// object associated with said submission
scoreForm.addEventListener("submit", function (event) {
  //this prevents the default behavior of form submission (default behavior being to reload the page)
  event.preventDefault();
  // calls the savescore function
  saveScore();
});

// sets scores as an empty array
let scores = [];

function saveScore() {
  // Save the user's initials and score
  // retrieves the value entered in the input field with the id initials (where user inputs initials)
  let initials = document.getElementById("initials").value;
  // sets the variable score to the value of timeRemaining
  let score = timeRemaining; // For simplicity, using the remaining time as the score
  // adds an object to the scores array containing the user's initials and score
  scores.push({ initials, score });
  // stores the scores array in the local storage under the key quizscores; JSON.stringify(scores) is used to convert
  // the array into a JSON string since local storage can only store strings
  localStorage.setItem("quizScores",JSON.stringify(scores));
  // logs the user's initials and score to the console for personal debugging
  console.log("Initials: " + initials + ", Score: " + score);
}

function displayScores() {
  // Retrieve string scores from local storage using quizscores
  let storedScores = localStorage.getItem("quizScores");

  // Parse the stored scores back into an aray (if any)
  // if there are no scores it starts an empty array
  // not going to lie, i got this line from chatgpt
  scores = storedScores ? JSON.parse(storedScores) : [];

  // Display scores in the scores-container
  // gets reference to the html element with the id scores-container
  let scoresContainer = document.getElementById("scores-container");
  // sets the inner html of the scores container to include an h2 element with the text scores; basically clears 
  // previous content in scores container and sets it to the header
  scoresContainer.innerHTML = "<h2>Scores</h2>";

  // Iterate through scores and append them to the container
  scores.forEach((entry, index) => {
    let scoreItem = document.createElement("div");
    scoreItem.textContent = `${index + 1}. ${entry.initials}: ${entry.score} seconds`;
    scoresContainer.appendChild(scoreItem);
  });
}

