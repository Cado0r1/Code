let turn = 0;
let gamestart = false;
let select = document.getElementById('turn_selector');
const human = 'X';
const bot = 'O';
let playerTurn = '';
let board = [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']];
function pressed(id) {
  let button = document.getElementById(id).innerHTML
  if (!gamestart || playerTurn === bot || button.innerHTML == 'O' || button.innerHTML == 'X') {
    return;
  }

  if (document.getElementById(id).innerHTML === '') {
    document.getElementById(id).classList.add('fade-in')
    document.getElementById(id).innerHTML = 'X';
    document.getElementById('turn_num').innerHTML = 'Player Turn: O ';
    playerTurn = bot;
    turn += 1;
    TextColour(id);
    DuplicateBoard(id);
    setTimeout(()=>botMove(),750)
  }
}

function RandomStart() {
  const min = Math.ceil(0);
  const max = Math.floor(2);
  const ran = Math.floor(Math.random() * (max - min + 1) + min);
  let char = '';

  if (ran === 0) {
    char = 'X';
    turn = 2;
    document.getElementById('turn_num').innerHTML = 'Player Turn: X';
    playerTurn = human;
  } else {
    char = 'O';
    turn = 3;
    document.getElementById('turn_num').innerHTML = 'Player Turn: O';
    playerTurn = bot;
    botMove()
  }
}

function SelectedStart() {
  const select = document.getElementById('turn_selector');

  if (turn < 2) {
    document.getElementById('turn_num').innerHTML = 'Player Turn: ' + select.value;

    if (select.value === 'X') {
      turn = 0;
      playerTurn = human;
    } else if (select.value === 'O') {
      turn = 1;
      playerTurn = bot;
      botMove();
    } else {
      RandomStart();
    }
  }
}

function StartGame() {
  gamestart = true;
  SelectedStart();
  document.getElementById('start_game').disabled = true;
}

function Reset() {
  if (gamestart) {
    gamestart = false;
    turn = 0;

    for (let i = 1; i < 10; i++) {
      document.getElementById(i.toString()).innerHTML = '';
      document.getElementById(i.toString()).className = '';
    }

    document.getElementById('turn_num').innerHTML = 'Player Turn: ... ';
  }

  document.getElementById('start_game').disabled = false;
  board = [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']];
}

function TextColour(id) {
  const button = document.getElementById(id);

  if (button.innerHTML === 'X') {
    button.classList.add('bluetextglow');
  } else if (button.innerHTML === 'O') {
    button.classList.add('redtextglow');
  }
}

function DuplicateBoard(id) {
  const a = parseInt(id);
  let b = 'X';
  if (a <= 3) {
    board[0][a - 1] = b;
  } else if (a <= 6) {
    board[1][a - 4] = b;
  } else {
    board[2][a - 7] = b;
  }

  if (isGameOver()) {
    getWinner(true);
  } 
}

function isBoardFull() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] == ' ') {
        return false;
      }
    }
  }
  return true;
}

function isGameOver() {
  if(getWinner(false) != null || isBoardFull()){
    return true;
  }
  else{
    return false;
  }
}


function getWinner(DisplayWin) {
  for (let row = 0; row < 3; row++) {
    if (board[row][0] !== ' ' && board[row][0] === board[row][1] && board[row][0] === board[row][2]) {
      if(DisplayWin){
        for(let i = 0;i<3;i++){
          setTimeout(()=>document.getElementById(BoardToPagePos(row,i)).classList.add('win'),(400*i+1)/2)
        }
      }
      else{
      return board[row][0];
      }
    }
  }

  for (let col = 0; col < 3; col++) {
    if (board[0][col] !== ' ' && board[0][col] === board[1][col] && board[0][col] === board[2][col]) {
      if(DisplayWin){
        for(let i = 0;i<3;i++){
          setTimeout(()=>document.getElementById(BoardToPagePos(i,col)).classList.add('win'),(400*i+1)/2)
        }
      }
      else{
        return board[0][col];
      }
    }
  }

  if (board[0][0] !== ' ' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    if(DisplayWin){
      for(let i = 0;i<3;i++){
        setTimeout(()=>document.getElementById(BoardToPagePos(i,i)).classList.add('win'),(400*i+1)/2)
      }
    }
    else{
    return board[0][0];
    }
  }

  if (board[0][2] !== ' ' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    if(DisplayWin){
      for(let i = 0;i<3;i++){
        let w = [2,1,0]
        setTimeout(()=>document.getElementById(BoardToPagePos(i,w[i])).classList.add('win'),(400*i+1)/2)
      }
    }
    return board[0][2];
  }

  return null;
}

function BoardToPagePos(r, c) {
  let pos;

  if (r === 0) {
    pos = 1 + c;
  } else if (r === 1) {
    pos = 4 + c;
  } else {
    pos = 7 + c;
  }

  return pos;
}

function botMove(){
  let bestScore = -Infinity;
  let bestMove;

  for(let row=0;row<3;row++){
    for(let col=0;col<3;col++){
      if(board[row][col] === ' '){
        board[row][col] = bot;
        let score = minimax(board, 0, false);
        board[row][col] = ' ';

        if(score > bestScore){
          bestScore = score;
          bestMove = {row,col};
        }
      }
    }
  }
  console.log(bestScore+': '+bestMove.row+','+bestMove.col)
  board[bestMove.row][bestMove.col] = bot;
  document.getElementById(BoardToPagePos(bestMove.row,bestMove.col).toString()).classList.add('fade-in')
  document.getElementById(BoardToPagePos(bestMove.row,bestMove.col).toString()).innerHTML = bot;
  document.getElementById(BoardToPagePos(bestMove.row,bestMove.col).toString()).classList.add('redtextglow');
  document.getElementById('turn_num').innerHTML = 'Player Turn: X '
  if (isGameOver()) {
    setTimeout(()=>getWinner(true),750)
  } 
  else {
    playerTurn = human;
  }
}

function minimax(board, depth, isMaximizing){
  if (isGameOver()) {
    let winner = getWinner(false);
    if (winner === bot) {
      return 10 - depth;
    } else if (winner === human) {
      return depth - 10;
    }
    return 0;
  }
  if(isMaximizing){
    let maxEval = -Infinity
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === ' ') {
          board[i][j] = bot;
          let eval = minimax(board,depth+1,false);
          board[i][j] = ' ';
          maxEval = Math.max(eval,maxEval);
          }
        }
      }
    return maxEval
  }
  else{
    let minEval = Infinity
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === ' ') {
          board[i][j] = human;
          let eval = minimax(board,depth+1,true);
          board[i][j] = ' ';
          minEval = Math.min(eval, minEval);
          }
        }
      }
    return minEval;
  }
}