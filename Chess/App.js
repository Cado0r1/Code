import { StyleSheet, Text, View } from 'react-native';
import '../static/menu.css'
import * as init from './initiateBB.js'
import * as ChessNotation from './ChessNotation.js'
import * as Move from './GenerateMoves.js'
import React, { useEffect, useState } from "react"

let Board = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
let selected = null
let formerselected = null
let ChessBoard = ChessNotation.CurrentBoard
let ChessNotationToNumber = ChessNotation.ChessNotationToNumber
let NumberToChessNotation = ChessNotation.NumberToChessNotation
let turn = 'w'?'w':'b'
let castleRights = 'kqKQ'
let halfmove = 0
let WhitePawns = init.initWhitePawns()
let WhiteBishops = init.initWhiteBishops()
let WhiteRooks = init.initWhiteRooks()
let WhiteQueen = init.initWhiteQueen()
let WhiteKing = init.initWhiteKing()
let WhiteKnights = init.initWhiteKnights()

let BlackPawns = init.initBlackPawns()
let BlackBishops = init.initBlackBishops()
let BlackRooks = init.initBlackRooks()
let BlackQueen = init.initBlackQueen()
let BlackKing = init.initBlackKing()
let BlackKnights = init.initBlackKnights()


function SetUpGame(){
  CreateTileColours();
  SetPieces(Board);
  addSelectFunctionality();
}

function move(){
  //Can only not move if king already in check
  //need to be able to block check
  //no move if king in check
  let piece = ChoosePiece(formerselected)
  let selectedpiece = ChoosePiece(selected)
  if(piece != '0'){
    if(piece === piece.toUpperCase()){
      if(Move.isAttacked(WhiteKing, WhitePieces(), BlackRooks, BlackBishops, BlackKnights, BlackQueen, BlackPawns, BlackPieces(),'White')){
        return
      }
    }
    else if(Move.isAttacked(BlackKing, BlackPieces(), WhiteRooks, WhiteBishops, WhiteKnights, WhiteQueen, WhitePawns, WhitePieces(),'Black')){
      return
    }
  }
  if(GetMoves(piece).includes(NumberToChessNotation[selected]) == false)
  {
  }
  else{
    UpdateCurrentBoard(NumberToChessNotation[formerselected],NumberToChessNotation[selected])
    ChooseBitboardUpdate(piece,formerselected,selected)
    UpdateFenString()
    document.getElementById(formerselected).classList.remove(piece)
    document.getElementById(selected).classList.add(piece)
    if(selectedpiece != '0'){
      document.getElementById(selected).classList.remove(selectedpiece)
      ChooseBitboardUpdate(selectedpiece,selected,'dead')
    }
    turn = !turn
    return
  }
}

function GetMoves(piece) {
  switch (piece) {
    // White pieces
    case 'P':
      return Move.WhitePawnMoves(WhitePieces(), BlackPieces(), NumberToChessNotation[formerselected]);
    case 'R':
      return Move.RookMoves(WhitePieces(),BlackPieces(), NumberToChessNotation[formerselected]);
    case 'Q':
      return Move.QueenMoves(WhitePieces(), BlackPieces(), NumberToChessNotation[formerselected]);
    case 'B':
      return Move.BishopMoves(WhitePieces(), BlackPieces(), NumberToChessNotation[formerselected]);
    case 'N':
      return Move.KnightMoves(WhitePieces(),NumberToChessNotation[formerselected]);
    case 'K':
      return Move.KingMoves(NumberToChessNotation[formerselected],WhitePieces(),BlackRooks,BlackBishops,BlackKnights,BlackQueen,BlackPawns,false,BlackPieces(),WhiteKing,'White',BlackKing);

    // Black pieces
    case 'p':
      return Move.BlackPawnMoves(BlackPieces(), WhitePieces(), NumberToChessNotation[formerselected]);
    case 'r':
      return Move.RookMoves(BlackPieces(), WhitePieces(), NumberToChessNotation[formerselected]);
    case 'q':
      return Move.QueenMoves(BlackPieces(), WhitePieces(), NumberToChessNotation[formerselected]);
    case 'b':
      return Move.BishopMoves(BlackPieces(), WhitePieces(), NumberToChessNotation[formerselected]);
    case 'n':
      return Move.KnightMoves(BlackPieces(),NumberToChessNotation[formerselected]);
    case 'k':
      return Move.KingMoves(NumberToChessNotation[formerselected],BlackPieces(),WhiteRooks,WhiteBishops,WhiteKnights,WhiteQueen,WhitePawns,false,WhitePieces(),BlackKing,'Black',WhiteKing);

    default:
      return '0'
  }
}



function ChoosePiece(id) {
  const element = document.getElementById(id);
  let piece;

  switch (true) {
    case element.classList.contains('p'):
      piece = 'p';
      break;
    case element.classList.contains('P'):
      piece = 'P';
      break;
    case element.classList.contains('r'):
      piece = 'r';
      break;
    case element.classList.contains('R'):
      piece = 'R';
      break;
    case element.classList.contains('q'):
      piece = 'q';
      break;
    case element.classList.contains('Q'):
      piece = 'Q';
      break;
    case element.classList.contains('n'):
      piece = 'n';
      break;
    case element.classList.contains('N'):
      piece = 'N';
      break;
    case element.classList.contains('k'):
      piece = 'k';
      break;
    case element.classList.contains('K'):
      piece = 'K';
      break;
    case element.classList.contains('b'):
      piece = 'b';
      break;
    case element.classList.contains('B'):
      piece = 'B';
      break;
    default:
      piece = '0';
  }
  
  return piece;
}



function ChooseBitboardUpdate(piece,formerselected,selected) {
  switch (piece) {
    // White pieces
    case 'P':
      WhitePawns = UpdateBitBoard(WhitePawns, formerselected, selected);
      break;
    case 'R':
      WhiteRooks = UpdateBitBoard(WhiteRooks, formerselected, selected);
      break;
    case 'Q':
      WhiteQueen = UpdateBitBoard(WhiteQueen, formerselected, selected);
      break;
    case 'B':
      WhiteBishops = UpdateBitBoard(WhiteBishops, formerselected, selected);
      break;
    case 'N':
      WhiteKnights = UpdateBitBoard(WhiteKnights, formerselected, selected);
      break;
    case 'K':
      WhiteKing = UpdateBitBoard(WhiteKing, formerselected, selected);
      break;

    // Black pieces
    case 'p':
      BlackPawns = UpdateBitBoard(BlackPawns, formerselected, selected);
      break;
    case 'r':
      BlackRooks = UpdateBitBoard(BlackRooks, formerselected, selected);
      break;
    case 'q':
      BlackQueen = UpdateBitBoard(BlackQueen, formerselected, selected);
      break;
    case 'b':
      BlackBishops = UpdateBitBoard(BlackBishops, formerselected, selected);
      break;
    case 'n':
      BlackKnights = UpdateBitBoard(BlackKnights, formerselected, selected);
      break;
    case 'k':
      BlackKing = UpdateBitBoard(BlackKing, formerselected, selected);
      break;
  }
}




function UpdateBitBoard(BB, oldPos, newPos) {
  if (newPos === 'dead') {
    oldPos = 64 - oldPos;
    const oldMask = 1n << BigInt(oldPos);
    BB = BB & ~oldMask;
  } else {
    oldPos = 64 - oldPos;
    newPos = 64 - newPos;
    const oldMask = 1n << BigInt(oldPos);
    const newMask = 1n << BigInt(newPos);
    BB = BB & ~oldMask;
    BB = BB | newMask;
  }
  console.log(oldPos);
  console.log(newPos);
  printBitboard(BB);
  return BB;
}


function UpdateCurrentBoard(from,to){
  let piece = ChessBoard[from]
  ChessBoard[from] = ' '
  ChessBoard[to] = piece
  console.log(ChessBoard)
}

function UpdateFenString() {
  let fen = '';

  for (const position in ChessBoard) {
    const piece = ChessBoard[position];
    fen += piece;
  }

  let formattedFen = '';
  for (let i = 0; i < fen.length; i++) {
    if (i % 8 === 0 && i > 0) {
      formattedFen += '/';
    }
    formattedFen += fen[i];
  }
  formattedFen = formatFen(formattedFen)
  console.log(formattedFen);
}

function formatFen(ChessBoard) {
  let fen = '';
  let emptySquareCount = 0;

  for (let i = 0; i < ChessBoard.length; i++) {
    const piece = ChessBoard[i];

    if (piece === ' ') {
      emptySquareCount++;
    } else {
      if (emptySquareCount > 0) {
        fen += emptySquareCount;
        emptySquareCount = 0;
      }
      fen += piece;
    }
  }

  if (emptySquareCount > 0) {
    fen += emptySquareCount;
  }

  return fen;
}

function WhitePieces() {
  return WhitePawns | WhiteBishops | WhiteKnights | WhiteQueen | WhiteKing | WhiteRooks;
}

function BlackPieces() {
  return BlackPawns | BlackBishops | BlackKnights | BlackQueen | BlackKing | BlackRooks;
}

function allPieces(){
  return  WhitePieces() | BlackPieces()
}



export function printBitboard(bitboard) {
  const boardString = bitboard.toString(2).padStart(64, '0');
  let output = '';

  for (let i = 0; i < 64; i++) {
    const char = boardString[i] === '1' ? '1' : '.';
    output += char;
    if ((i + 1) % 8 === 0) {
      output += '\n';
    } else {
      output += ' ';
    }
  }
  console.log(boardString)
  console.log(output);
}

function GenerateBoard(){
  let ids = []
  for (let i = 0; i < 64; i++) {
    ids.push(i)
  } 
  return (
      <div id='ChessBoard'>
        {ids.map((ids)=>(
          <div id={ids+1} class='tile' type='Button'></div>
        ))}
      </div>
  );
}

function CreateTileColours() {
  for (let i = 1; i <= 64; i++) {
    const isWhite = (i + Math.floor((i - 1) / 8)) % 2 === 0;
    // i gets the square and checks if even and odd to return true or false
    // we shift what i is by adding the row number (Math.floor((i - 1) / 8)) to get alternating rows
    const tileColor = isWhite ? 'White' : 'Black';
    document.getElementById(i.toString()).classList.add(tileColor);
  }
}


function addSelectFunctionality(){
  for(let i =1;i<65;i++){
    document.getElementById(i.toString()).onclick = function(){
      formerselected = selected
      selected = i.toString()
      document.getElementById(selected).classList.toggle('highlight')
      if(document.getElementById(formerselected).classList.contains('highlight')){
        move()
      }
      if(formerselected != null && formerselected != selected){
        document.getElementById(formerselected).classList.remove('highlight')
      }
    }
  }
}


function isNumeric(num){
  return !isNaN(num)
}

function SetPieces(Board){
  let k = 1
  for (let i = 1; i < 8; i++) {
    Board = Board.replace('/','')
  }
  for (let l = k; l < 65; l++) {
    if(isNumeric(Board[k-1])){
       // If the character in Board is a numeric value (indicating empty squares),
      // increment l (tile ID) by that numeric value - 1 to skip the empty squares
      l=l+Number(Board[k-1])-1
    }
    else{
      document.getElementById(l.toString()).classList.add(Board[k-1].toString())
    }
    k++
  }
} 

export default function app(){
  return(
    <GenerateBoard></GenerateBoard>
  )
}
setTimeout(() => {
  SetUpGame();
}, "1");


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});