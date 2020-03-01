// store all usefull elements
const startElement = document.getElementById("start");
const gameAreaElement = document.getElementById("gameArea");
const problemElement = document.getElementById("problem");
const solutionElement = document.getElementById("solution");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const highscoreElement = document.getElementById("highscore");

// set up game timer that counts down until game is over
let timer = new Timer(timerElement);

// stats used by the game
let gameStats = {
  score: 0,
  highscore: 0,
  currentSolution: 0
};

// user settings
let settings = {
  timeToSolve: 60,
  bounds: [1,10]
};

// remove unwanted elements from view
problemElement.style.disply = 'none';
solutionElement.style.display = 'none';
scoreElement.style.display = 'none';


solutionElement.addEventListener('keyup', (event) => {
  // eventlistener that submits solution when you press enter
  if (event.keyCode === 13) {
    event.preventDefault();
    submitSolution(solutionElement.valueAsNumber);
    solutionElement.value = '';
    solutionElement.focus();
  }
});


function startGame() {
  // change the view and focus()
  startElement.style.display = 'none';
  solutionElement.style.display = '';
  scoreElement.style.display = '';
  problemElement.style.display = '';
  solutionElement.focus();

  //reset score and input
  gameStats.score = 0;
  viewScore();
  solutionElement.value = '';

  // Start game
  timer.start(settings.timeToSolve);
  nextAttempt();

}

function endGame() {
  // bring the start game button back and remove game elements
  startElement.style.display = ""; 
  solutionElement.style.display = 'none';
  problemElement.style.display = 'none';

  updateHighscore();
}


function Timer(element) {
  this.seconds;
  
  // called on game start
  this.start = (time = 60) => {
    this.seconds = time;
    setTimeout(() => {
      this.update();
    }, 1000);
  };

  // updates the time and view every second and ends game if timer reaches 0
  this.update = () => {
    if (this.isTimeLeft()) {
      this.updateTime();
      this.updateView();
      setTimeout(() => {
        this.update();
      }, 1000);
    } else {
      endGame();
    } 
  };

  // reduces time left by 1
  this.updateTime = () => {
    this.seconds -= 1;
  };

  // prints time left in background
  this.updateView = () => {
    element.innerHTML = `${this.seconds}`;
  };

  // checks if there is time left
  this.isTimeLeft = () => {
    return this.seconds > 0 ? true: false;
  };
}

function nextAttempt() {
  // randomly select numbers to be operated from bounds
  let x = randomNumberFromBounds(settings.bounds);
  let y = randomNumberFromBounds(settings.bounds);

  // stores the correct solution in the gameStats object
  gameStats.currentSolution = x + y;

  // shows user the problem
  problemElement.innerHTML = `${x} + ${y}`;
}

function submitSolution(answer) {
  // called with the value of the input field when you press enter
  // if the solution provided is correct score is increased by one
  if (solutionIsCorrect(gameStats.currentSolution, answer)) {
    gameStats.score += 1;
    viewScore();
  }

  // right or wrong give the player a new problem
  nextAttempt();
}

function viewScore() {
  // updates the score element to reflect the current score
  scoreElement.innerHTML = `Poäng: ${gameStats.score}`;
}

function updateHighscore() {
  // is called at end of game to update highscore if the rounds score is higher
  if (gameStats.score > gameStats.highscore) {
    gameStats.highscore = gameStats.score;
  }
  // display the highscore
  highscoreElement.innerHTML = `Bästa: ${gameStats.highscore}`;
}

function randomNumberFromBounds(arr) {
  // takes an array and returns a random number in the range of the first two items.
  return Math.floor( Math.random() * (arr[1] - arr[0] + 1)) + arr[0];
}

function solutionIsCorrect(solution, answer) {
  // evaluate the solution and return true or false
  return solution === answer ? true: false;
}