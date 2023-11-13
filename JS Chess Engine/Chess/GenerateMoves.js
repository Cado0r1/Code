import * as ChessNotation from './ChessNotation.js'
import {printBitboard} from './App.js'

let ChessNotationToNumber = ChessNotation.ChessNotationToNumber
let NumberToChessNotation = ChessNotation.NumberToChessNotation

function BitboardToChessNotation(bitboard) {
  // Convert the bitboard to a binary string with 64 characters
  const binaryStr = bitboard.toString(2).padStart(64, '0');
  
  // Find the index of the least significant '1' bit (rightmost '1')
  const indexOfLSB = binaryStr.lastIndexOf('1');
  
  if (indexOfLSB !== -1) {
    // Use the index to get the corresponding chess notation
    const square = NumberToChessNotation[indexOfLSB+1];
    return square;
  }
  
  return null; // No '1' bit found in the bitboard
}


  export function WhitePawnMoves(WhitePawns, OpposingPieces, Square) {
    const Moves = [];
    const Num = ChessNotationToNumber[Square];
    const binaryString = "0".repeat(64);
    const binaryArray = binaryString.split("");
    binaryArray[Num] = "1";
    let square = binaryArray.join("");
    square = '0b'+square
  
    const singleSquare = BigInt(square) << BigInt(9);
    if (!(WhitePawns & singleSquare) && !(OpposingPieces & singleSquare)) {
      Moves.push(BitboardToChessNotation(singleSquare).toString());
    }
  
    if (Num > 48 && Num < 57) {
      const doubleSquare = BigInt(square) << BigInt(17);
      if (!(WhitePawns & doubleSquare) && !(OpposingPieces & doubleSquare) && !(singleSquare & doubleSquare)) {
        Moves.push(BitboardToChessNotation(doubleSquare).toString());
      }
    }
    const attackLeft =  BigInt(square) << BigInt(10);
    if (attackLeft & OpposingPieces) {
        Moves.push(BitboardToChessNotation(attackLeft).toString());
    }

    const attackRight = BigInt(square) << BigInt(8);
    if (attackRight & OpposingPieces) {
        Moves.push(BitboardToChessNotation(attackRight).toString());
    }

    return Moves;
  }
  
  export function BlackPawnMoves(BlackPawns, OpposingPieces, Square){
    const Moves = [];
    const Num = ChessNotationToNumber[Square];
    const binaryString = "0".repeat(64);
    const binaryArray = binaryString.split("");
    binaryArray[Num] = "1";
    let square = binaryArray.join("");
    square = '0b' + square;

    const singleSquare = BigInt(square) >> BigInt(7);
    if (!(BlackPawns & singleSquare) && !(OpposingPieces & singleSquare)) {
      Moves.push(BitboardToChessNotation(singleSquare).toString());
    }

    if (Num > 8 && Num < 17) {
      const doubleSquare = BigInt(square) >> BigInt(15);
      if (!(BlackPawns & doubleSquare) && !(OpposingPieces & doubleSquare) && !(singleSquare & doubleSquare)) {
        Moves.push(BitboardToChessNotation(doubleSquare).toString());
      }
    }

    const attackLeft = BigInt(square) >> BigInt(8);
    if (attackLeft & OpposingPieces) {
      Moves.push(BitboardToChessNotation(attackLeft).toString());
    }

    const attackRight = BigInt(square) >> BigInt(6);
    if (attackRight & OpposingPieces) {
      Moves.push(BitboardToChessNotation(attackRight).toString());
    }

    return Moves;
  }

