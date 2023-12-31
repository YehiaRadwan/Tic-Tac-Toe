function addArea (newBoard, index, symbol) {
    if (currWinner == null) {
      if (newBoard[index] == null) {
        if (audioTrigger) {
          playSound(2);
        }
        newBoard[index] = symbol;
  
        if (audioTrigger) {
          let cell = document.getElementById(index);
          cell.innerHTML = symbol;
        }
  
        return true;
      }else {
        if (audioTrigger) {
          playSound(3);
        }
        return false;
      }
    }
  }
  

  let computerTurn = (newBoard) => {
    audioTrigger = false;
    let bestScore = -Infinity;
    let bestRoute;
    let symbol = AI;   
    for (let x = 0; x < 9; x++) {
      let tempBoard = newBoard.slice();
      let result = addArea(tempBoard, x, symbol);
      if (result) {
        let score = minimaxAlgo(tempBoard, false, 0);
        if (score > bestScore) {
          bestScore = score;
          bestRoute = x;
        }
      }
    }
  
    turn = 0;     
    audioTrigger = true;
    addArea(newBoard, bestRoute, symbol);
    result = checkWinner(newBoard);
    if (result !== false ) {
      setResult(result);
    }
  }
  
  let scores = [10, -10, 0];
  
  function minimaxAlgo (tempBoard, isMaximizing, depth) { 
    let result = checkWinner(tempBoard);
    if (result != false) {
      if (isMaximizing) {
        return scores[result.winner] + depth;
      }else {
        return scores[result.winner] - depth;
      }
    }
    turn = isMaximizing ? 0 : 1;
    let bestScore = isMaximizing? -Infinity: Infinity;
    for (let i = 0; i < 9; i++) {
        let symbol = isMaximizing ? AI : PLAYER;
        let newBoard = tempBoard.slice();
        let result = addArea(newBoard, i, symbol);
        if (result) {
          let score = minimaxAlgo(newBoard, !isMaximizing, depth + 1);
          bestScore = (isMaximizing) ? Math.max(score, bestScore) : Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
  
  function getEmptyCellsSize (tempBoard) {
    return tempBoard.reduce((accu, curr, index)=> (curr === null)? accu.concat(index): accu, []).length;
  }