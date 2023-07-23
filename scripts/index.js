let closeBtn, gameOverMenu, winnerTeam, shader;
let currWinner = null, audioTrigger;

let gameBoard;
let boardTable = document.getElementsByTagName("table")[0];
let cells = document.querySelectorAll("td");
let restartBtn = document.getElementById("restart");

const PLAYER = "O", AI = "X";

let board;
let turn;

const SOLUTIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

window.onload = () => {
  turn = 0;  //computer turn 
  gameInit();
}

function checkWinner(tempBoard) {
  let team = (turn == 1) ? PLAYER : AI;

  let plays = tempBoard.reduce((accu, curr, index) => (curr === team) ? accu.concat(index) : accu, []);
  console.log("plays for " + team + "are:" + plays)


  for (let [index, win] of SOLUTIONS.entries()) {
    if (win.every(element => plays.indexOf(element) != -1)) {
      return { winner: turn, winCombos: index };
    }
  }

  //if there's no winner and the remaining empty cell is zero, its a draw so return 2.
  if (getEmptyCellsSize(tempBoard) == 0) {
    return { winner: 2, winCombos: null };
  }
  return false
}

let cellsClicked = (event) => {
  let cellAvailable = addArea(board, event.target.id, PLAYER);
  if (cellAvailable) {
    let result = checkWinner(board);
    turn = 0;  //computer 
    if (result != false) {
      setResult(result);
    } else if (turn == 0) {
      computerTurn(board);
      turn = 1;
    }
  }
}

function setResult(result) {
  setTimeout(gameOver(result), 1500);
  let combos = result.winCombos;
  if (combos != null) {
    let position = SOLUTIONS[combos];
    for (let x of position) {
      document.getElementById(x).style.backgroundColor = "green";
    }
  }
}

let gameInit = () => {
  currWinner = null;
  board = new Array(9);
  audioTrigger = true;

  closeBtn = document.getElementById("close");
  gameOverMenu = document.getElementById("gameOver")
  winnerTeam = document.getElementById("winTeam")
  shader = document.getElementById("shader");

  if (turn == 0) {
    setTimeout(() => {
      randomMove(board);
    }, 500);
    turn = 1;
  }

  closeBtn.addEventListener("click", closeGameOverMenu, false);
  restartBtn.style.display = "none";

  for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    cells[cellIndex].innerHTML = "";
    cells[cellIndex].style.backgroundColor = "transparent"
    board.fill(null);
    cells[cellIndex].addEventListener("click", cellsClicked, false);
  }
}

let closeGameOverMenu = () => {

  shader.style.opacity = "0";
  gameOverMenu.style.opacity = "0";

  setTimeout(() => {
    shader.style.display = "none"
    gameOverMenu.style.display = "none";
  }, 300);
}

//playing sound effects
// 0 = win, 1 = button click, 2 = add symbol to area 

let playSound = (soundIndex) => {
  let musicArr = ["win", "click", "areaAdded", "error"];
  if (Number.isInteger(soundIndex) != true) soundIndex = 2;
  let winSound = new Audio(`music/${musicArr[soundIndex]}.mp3`);
  //winSound.volume = (soundIndex == 0) ? 0.3 : 0.7;
  winSound.play();
}




let gameOver = (result) => {
  setTimeout(playSound(0), 900);
  currWinner = result.winner;
  let winner = (currWinner == 1) ? { team: "Player", scoreId: "playerScore" } : (currWinner == 0) ? { team: "Computer", scoreId: "enemyScore" } : { team: "Draw", scoreId: null };
  if (winner.scoreId != null) {
    let scorer = document.getElementById(winner.scoreId);
    console.log(winner.scoreId)
    scorer.innerHTML = Number(scorer.innerHTML) + 1;
  }
  shader.style.display = "block";
  gameOverMenu.style.display = "block";
  setTimeout(() => {
    shader.style.opacity = "1.0"
    gameOverMenu.style.opacity = "1.0";
    restartBtn.style.display = "block";
  }, 300);
  winnerTeam.innerHTML = winner.team;
}

function randomMove(theBoard) {
  let position = Math.floor(Math.random() * 9);
  console.log(position);
  let test = document.getElementById(position);
  test.innerHTML = AI;  //X
  console.log(test);
  theBoard[position] = AI;
  console.log(theBoard)
}
