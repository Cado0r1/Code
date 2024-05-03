import * as ChessNotation from './ChessNotation.js'
import {printBitboard} from './App.js'

let ChessNotationToNumber = ChessNotation.ChessNotationToNumber
let NumberToChessNotation = ChessNotation.NumberToChessNotation

export function BitboardToChessNotation(bitboard) {
  try{
    let bb = bitboard.toString(2);
    let count = bb.length-1;
    return NumberToChessNotation[64-count].toString()
  }
  catch(TypeError){
    return
  }
}

export function ChessNotationToBitboard(ChessNotation){
  let num = 64 - ChessNotationToNumber[ChessNotation]
  let Binarystr = '1'
  for(let i=0;i<num;i++){
    Binarystr = Binarystr+'0'
  }
  let fill = 64-Binarystr.length
  for(let i = 0; i<fill;i++){
    Binarystr = '0'+Binarystr
  }
  Binarystr = '0b'+Binarystr
  return Binarystr
}

export function WhitePawnMoves(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let num = ChessNotationToNumber[Square];
  let SquareBinary = ChessNotationToBitboard(Square);

  let SinglePawnPush = BigInt(SquareBinary) << BigInt(8);
  if (!(SinglePawnPush & OpposingPieces) & !(SinglePawnPush & TeamPieces)) {
    BBorCN ? Moves.push(SinglePawnPush) : Moves.push(BitboardToChessNotation(SinglePawnPush));
  }

  if (num > 48 & num < 57) {
    let DoublePawnPush = BigInt(SquareBinary) << BigInt(16);
    if (!(DoublePawnPush & OpposingPieces) & !(DoublePawnPush & TeamPieces)) {
      BBorCN ? Moves.push(DoublePawnPush) : Moves.push(BitboardToChessNotation(DoublePawnPush));
    }
  }

  if (!(Square.includes('A'))) {
    let PawnAttackNW = BigInt(SquareBinary) << BigInt(9);
    if (PawnAttackNW & OpposingPieces) {
      BBorCN ? Moves.push(PawnAttackNW) : Moves.push(BitboardToChessNotation(PawnAttackNW));
    }
  }

  if (!(Square.includes('H'))) {
    let PawnAttackNE = BigInt(SquareBinary) << BigInt(7);
    if (PawnAttackNE & OpposingPieces) {
      BBorCN ? Moves.push(PawnAttackNE) : Moves.push(BitboardToChessNotation(PawnAttackNE));
    }
  }

  return Moves;
}

export function BlackPawnMoves(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let num = ChessNotationToNumber[Square];
  let SquareBinary = ChessNotationToBitboard(Square);

  let SinglePawnPush = BigInt(SquareBinary) >> BigInt(8);
  console.log('Oppose');
  printBitboard(OpposingPieces);
  console.log('Push');
  printBitboard(SinglePawnPush);
  if (!(SinglePawnPush & OpposingPieces) & !(SinglePawnPush & TeamPieces)) {
    BBorCN ? Moves.push(SinglePawnPush) : Moves.push(BitboardToChessNotation(SinglePawnPush));
  }

  if (num > 8 & num < 17) {
    let DoublePawnPush = BigInt(SquareBinary) >> BigInt(16);
    if (!(DoublePawnPush & OpposingPieces) & !(DoublePawnPush & TeamPieces)) {
      BBorCN ? Moves.push(DoublePawnPush) : Moves.push(BitboardToChessNotation(DoublePawnPush));
    }
  }

  if (!(Square.includes('A'))) {
    let PawnAttackSW = BigInt(SquareBinary) >> BigInt(7);
    if (PawnAttackSW & OpposingPieces) {
      BBorCN ? Moves.push(PawnAttackSW) : Moves.push(BitboardToChessNotation(PawnAttackSW));
    }
  }

  if (!(Square.includes('H'))) {
    let PawnAttackSE = BigInt(SquareBinary) >> BigInt(9);
    if (PawnAttackSE & OpposingPieces) {
      BBorCN ? Moves.push(PawnAttackSE) : Moves.push(BitboardToChessNotation(PawnAttackSE));
    }
  }

  return Moves;
}

function NorthFill(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let SquareBinary = ChessNotationToBitboard(Square);
  if (Square.includes('8')) {
    return Moves;
  }
  let north = BigInt(SquareBinary) << BigInt(8);
  while (true) {
    if (!(north & TeamPieces)) {
      if ((north & OpposingPieces) || (BitboardToChessNotation(north).toString().includes('8'))) {
        BBorCN ? Moves.push(north) : Moves.push(BitboardToChessNotation(north));
        return Moves;
      } else {
        BBorCN ? Moves.push(north) : Moves.push(BitboardToChessNotation(north));
        north = BigInt(north) << BigInt(8);
      }
    } else {
      return Moves;
    }
  }
}

function EastFill(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let SquareBinary = ChessNotationToBitboard(Square);
  if (Square.includes('H')) {
    return Moves;
  }
  let east = BigInt(SquareBinary) >> BigInt(1);
  while (true) {
    if (!(east & TeamPieces)) {
      if ((east & OpposingPieces) || (BitboardToChessNotation(east).toString().includes('H'))) {
        BBorCN ? Moves.push(east) : Moves.push(BitboardToChessNotation(east));
        return Moves;
      } else {
        BBorCN ? Moves.push(east) : Moves.push(BitboardToChessNotation(east));
        east = BigInt(east) >> BigInt(1);
      }
    } else {
      return Moves;
    }
  }
}

function WestFill(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let SquareBinary = ChessNotationToBitboard(Square);
  if (Square.includes('A')) {
    return Moves;
  }
  let west = BigInt(SquareBinary) << BigInt(1);
  while (true) {
    if (!(west & TeamPieces)) {
      if ((west & OpposingPieces) || (BitboardToChessNotation(west).toString().includes('A'))) {
        BBorCN ? Moves.push(west) : Moves.push(BitboardToChessNotation(west));
        return Moves;
      } else {
        BBorCN ? Moves.push(west) : Moves.push(BitboardToChessNotation(west));
        west = BigInt(west) << BigInt(1);
      }
    } else {
      return Moves;
    }
  }
}

function SouthFill(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let SquareBinary = ChessNotationToBitboard(Square);
  if (Square.includes('1')) {
    return Moves;
  }
  let south = BigInt(SquareBinary) >> BigInt(8);
  while (true) {
    if (!(south & TeamPieces)) {
      if ((south & OpposingPieces) || (BitboardToChessNotation(south).toString().includes('1'))) {
        BBorCN ? Moves.push(south) : Moves.push(BitboardToChessNotation(south));
        return Moves;
      } else {
        BBorCN ? Moves.push(south) : Moves.push(BitboardToChessNotation(south));
        south = BigInt(south) >> BigInt(8);
      }
    } else {
      return Moves;
    }
  }
}

function NorthEastFill(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let SquareBinary = ChessNotationToBitboard(Square);
  if (Square.includes('8') || Square.includes('H')) {
    return Moves;
  }
  let northeast = BigInt(SquareBinary) << BigInt(7);
  while (true) {
    if (!(northeast & TeamPieces)) {
      if ((northeast & OpposingPieces) || (BitboardToChessNotation(northeast).toString().includes('8')) || (BitboardToChessNotation(northeast).toString().includes('H'))) {
        BBorCN ? Moves.push(northeast) : Moves.push(BitboardToChessNotation(northeast));
        return Moves;
      } else {
        BBorCN ? Moves.push(northeast) : Moves.push(BitboardToChessNotation(northeast));
        northeast = BigInt(northeast) << BigInt(7);
      }
    } else {
      return Moves;
    }
  }
}

function NorthWestFill(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let SquareBinary = ChessNotationToBitboard(Square);
  if (Square.includes('8') || Square.includes('A')) {
    return Moves;
  }
  let northwest = BigInt(SquareBinary) << BigInt(9);
  while (true) {
    if (!(northwest & TeamPieces)) {
      if ((northwest & OpposingPieces) || (BitboardToChessNotation(northwest).toString().includes('8')) || (BitboardToChessNotation(northwest).toString().includes('A'))) {
        BBorCN ? Moves.push(northwest) : Moves.push(BitboardToChessNotation(northwest));
        return Moves;
      } else {
        BBorCN ? Moves.push(northwest) : Moves.push(BitboardToChessNotation(northwest));
        northwest = BigInt(northwest) << BigInt(9);
      }
    } else {
      return Moves;
    }
  }
}

function SouthEastFill(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let SquareBinary = ChessNotationToBitboard(Square);
  if (Square.includes('1') || Square.includes('H')) {
    return Moves;
  }
  let southeast = BigInt(SquareBinary) >> BigInt(9);
  while (true) {
    if (!(southeast & TeamPieces)) {
      if ((southeast & OpposingPieces) || (BitboardToChessNotation(southeast).toString().includes('1')) || (BitboardToChessNotation(southeast).toString().includes('H'))) {
        BBorCN ? Moves.push(southeast) : Moves.push(BitboardToChessNotation(southeast));
        return Moves;
      } else {
        BBorCN ? Moves.push(southeast) : Moves.push(BitboardToChessNotation(southeast));
        southeast = BigInt(southeast) >> BigInt(9);
      }
    } else {
      return Moves;
    }
  }
}

function SouthWestFill(TeamPieces, OpposingPieces, Square, BBorCN) {
  let Moves = [];
  let SquareBinary = ChessNotationToBitboard(Square);
  if (Square.includes('1') || Square.includes('A')) {
    return Moves;
  }
  let southwest = BigInt(SquareBinary) >> BigInt(7);
  while (true) {
    if (!(southwest & TeamPieces)) {
      if ((southwest & OpposingPieces) || (BitboardToChessNotation(southwest).toString().includes('1')) || (BitboardToChessNotation(southwest).toString().includes('A'))) {
        BBorCN ? Moves.push(southwest) : Moves.push(BitboardToChessNotation(southwest));
        return Moves;
      } else {
        BBorCN ? Moves.push(southwest) : Moves.push(BitboardToChessNotation(southwest));
        southwest = BigInt(southwest) >> BigInt(7);
      }
    } else {
      return Moves;
    }
  }
}


export function RookMoves(TeamPieces,OpposingPieces,Square){
  let Moves = []
  let NorthMoves = NorthFill(TeamPieces, OpposingPieces, Square, false);
  let EastMoves = EastFill(TeamPieces, OpposingPieces, Square, false);
  let WestMoves = WestFill(TeamPieces, OpposingPieces, Square, false);
  let SouthMoves = SouthFill(TeamPieces, OpposingPieces, Square, false);
  Moves = NorthMoves+EastMoves+WestMoves+SouthMoves
  return Moves
}

export function BishopMoves(TeamPieces,OpposingPieces,Square){
  let Moves = []
  let NorthEastMoves = NorthEastFill(TeamPieces, OpposingPieces, Square, false);
  let NorthWestMoves = NorthWestFill(TeamPieces, OpposingPieces, Square, false);
  let SouthEastMoves = SouthEastFill(TeamPieces, OpposingPieces, Square, false);
  let SouthWestMoves = SouthWestFill(TeamPieces, OpposingPieces, Square, false);
  Moves = NorthWestMoves+NorthEastMoves+SouthWestMoves+SouthEastMoves
  return Moves
}

export function KnightMoves(TeamPieces, Square, BBorCN) {
  const Moves = [];
  const SquareBinary = BigInt(ChessNotationToBitboard(Square));

  // Top
  const UpUpRight = SquareBinary << BigInt(15);
  const UpUpLeft = SquareBinary << BigInt(17);
  const UpRightRight = SquareBinary << BigInt(6);
  const UpLeftLeft = SquareBinary << BigInt(10);

  // Bottom
  const DownLeftLeft = SquareBinary >> BigInt(6);
  const DownRightRight = SquareBinary >> BigInt(10);
  const DownDownRight = SquareBinary >> BigInt(17);
  const DownDownLeft = SquareBinary >> BigInt(15);

  // Check and add moves for each direction
  if (!(TeamPieces & UpLeftLeft) && !(Square.includes('8')) && !(Square.includes('A')) && !(Square.includes('B'))) {
    console.log(BitboardToChessNotation(UpLeftLeft))
    BBorCN ? Moves.push(UpLeftLeft) : Moves.push(BitboardToChessNotation(UpLeftLeft));
  }
  if (!(TeamPieces & UpUpLeft) && !(Square.includes('8')) && !(Square.includes('7')) && !(Square.includes('A'))) {
    console.log(BitboardToChessNotation(UpUpLeft))
    BBorCN ? Moves.push(UpUpLeft) : Moves.push(BitboardToChessNotation(UpUpLeft));
  }

  if (!(TeamPieces & UpRightRight) && !(Square.includes('G')) && !(Square.includes('H')) && !(Square.includes('8'))) {
    console.log(BitboardToChessNotation(UpRightRight))
    BBorCN ? Moves.push(UpRightRight) : Moves.push(BitboardToChessNotation(UpRightRight));
  }
  if (!(TeamPieces & UpUpRight) && !(Square.includes('8')) && !(Square.includes('7')) && !(Square.includes('H'))) {
    console.log(BitboardToChessNotation(UpUpRight))
    BBorCN ? Moves.push(UpUpRight) : Moves.push(BitboardToChessNotation(UpUpRight));
  }

  if (!(TeamPieces & DownLeftLeft) && !(Square.includes('A')) && !(Square.includes('B')) && !(Square.includes('1'))) {
    console.log(BitboardToChessNotation(DownLeftLeft))
    BBorCN ? Moves.push(DownLeftLeft) : Moves.push(BitboardToChessNotation(DownLeftLeft));
  }
  if (!(TeamPieces & DownDownLeft) && !(Square.includes('1')) && !(Square.includes('2')) && !(Square.includes('A'))) {
    console.log(BitboardToChessNotation(DownDownLeft))
    BBorCN ? Moves.push(DownDownLeft) : Moves.push(BitboardToChessNotation(DownDownLeft));
  }

  if (!(TeamPieces & DownRightRight) && !(Square.includes('A')) && !(Square.includes('G')) && !(Square.includes('H'))) {
    console.log(BitboardToChessNotation(DownRightRight))
    BBorCN ? Moves.push(DownRightRight) : Moves.push(BitboardToChessNotation(DownRightRight));
  }
  if (!(TeamPieces & DownDownRight) && !(Square.includes('1')) && !(Square.includes('2')) && !(Square.includes('H'))) {
    console.log(BitboardToChessNotation(DownDownRight))
    BBorCN ? Moves.push(DownDownRight) : Moves.push(BitboardToChessNotation(DownDownRight));
  }

  return Moves;
}








export function QueenMoves(TeamPieces,OpposingPieces,Square){
  let Moves = []
  let NorthMoves = NorthFill(TeamPieces, OpposingPieces, Square, false);
  let EastMoves = EastFill(TeamPieces, OpposingPieces, Square, false);
  let WestMoves = WestFill(TeamPieces, OpposingPieces, Square, false);
  let SouthMoves = SouthFill(TeamPieces, OpposingPieces, Square, false);
  let NorthEastMoves = NorthEastFill(TeamPieces, OpposingPieces, Square, false);
  let NorthWestMoves = NorthWestFill(TeamPieces, OpposingPieces, Square, false);
  let SouthEastMoves = SouthEastFill(TeamPieces, OpposingPieces, Square, false);
  let SouthWestMoves = SouthWestFill(TeamPieces, OpposingPieces, Square, false);
  Moves = NorthMoves+EastMoves+WestMoves+SouthMoves+NorthEastMoves+NorthWestMoves+SouthEastMoves+SouthWestMoves
  return Moves
}

export function isAttacked(Square, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces,colour) {
  // Instead of checking each move of the opposing colour which would be very slow we check for opposing pieces from the square with directional fills
  // for example if we were to check for a bishop or a queen we check the diagonal moves from the square and if an opposing queen or bishop is there
  Square = BitboardToChessNotation(Square)
  let diagonalMoves = []
  let straightMoves = []
  const NorthEastMoves = NorthEastFill(TeamPieces, OpposingPieces, Square, true);
  const NorthWestMoves = NorthWestFill(TeamPieces, OpposingPieces, Square, true);
  const SouthEastMoves = SouthEastFill(TeamPieces, OpposingPieces, Square, true);
  const SouthWestMoves = SouthWestFill(TeamPieces, OpposingPieces, Square, true);
  diagonalMoves = diagonalMoves.concat (NorthEastMoves , NorthWestMoves , SouthEastMoves , SouthWestMoves)
  const NorthMoves = NorthFill(TeamPieces, OpposingPieces, Square, true);
  const EastMoves = EastFill(TeamPieces, OpposingPieces, Square, true);
  const WestMoves = WestFill(TeamPieces, OpposingPieces, Square, true);
  const SouthMoves = SouthFill(TeamPieces, OpposingPieces, Square, true);
  straightMoves = straightMoves.concat (NorthMoves , SouthMoves , EastMoves , WestMoves)
  const Knight_Moves = KnightMoves(TeamPieces, Square, true);
  const pawnMoves = colour === 'White' ? WhitePawnMoves(TeamPieces, OpposingPieces, Square, true) : BlackPawnMoves(TeamPieces, OpposingPieces, Square, true);

  for (let i = 0; i < diagonalMoves.length; i++) {
    if (diagonalMoves[i] & OppBishop || diagonalMoves[i] & OppQueen) {
      return true;
    }
  }

  for (let i = 0; i < straightMoves.length; i++) {
    if (straightMoves[i] & OppRook || straightMoves[i] & OppQueen) {
      return true;
    }
  }

  for (let i = 0; i < Knight_Moves.length; i++) {
    if (Knight_Moves[i] & OppKnight) {
      console.log(BitboardToChessNotation(Knight_Moves[i]))
      return true;
    }
  }

  for (let i = 0; i < pawnMoves.length; i++) {
    if (pawnMoves[i] & OppPawn) {
      console.log(BitboardToChessNotation(pawnMoves[i]))
      return true;
    }
  }

  return false;
}

function GetKingMoves(SquareBinary){
  const Up = SquareBinary << BigInt(8);
  const UpLeft = SquareBinary << BigInt(9);
  const UpRight = SquareBinary << BigInt(7);
  const Left = SquareBinary << BigInt(1);

  const Right = SquareBinary >> BigInt(1);
  const DownLeft = SquareBinary >> BigInt(7);
  const DownRight = SquareBinary >> BigInt(9);
  const Down = SquareBinary >> BigInt(8);

  let Binarystr = Up|UpLeft|UpRight|Left|Right|DownRight|DownLeft|Down
  while((Binarystr).toString(2).length > 64){
    Binarystr = Binarystr & (Binarystr - BigInt(1));
  }
  printBitboard(Binarystr)
  return Binarystr
}


export function KingMoves(Square, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, BBorCN,OpposingPieces, King,colour,OppKing) {
  const Moves = [];
  const SquareBinary = BigInt(ChessNotationToBitboard(Square));
  TeamPieces = TeamPieces ^ King

  const Up = SquareBinary << BigInt(8);
  const UpLeft = SquareBinary << BigInt(9);
  const UpRight = SquareBinary << BigInt(7);
  const Left = SquareBinary << BigInt(1);

  const Right = SquareBinary >> BigInt(1);
  const DownLeft = SquareBinary >> BigInt(7);
  const DownRight = SquareBinary >> BigInt(9);
  const Down = SquareBinary >> BigInt(8);

  printBitboard(OppKing)
  OppKing = BitboardToChessNotation(OppKing)
  OppKing = GetKingMoves(BigInt(ChessNotationToBitboard(OppKing)))
  printBitboard(OppKing)
  printBitboard(OppKing >> BigInt(8))


  if (!(Square.includes('8'))){
    if (!(Up & TeamPieces) && !(Up & OppKing) && !isAttacked(Up, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces, colour)) {
        BBorCN ? Moves.push(Up) : Moves.push(BitboardToChessNotation(Up));
    }

    if (!(UpLeft & TeamPieces) && !(UpLeft &OppKing) && !isAttacked(UpLeft, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces, colour)) {
        BBorCN ? Moves.push(UpLeft) : Moves.push(BitboardToChessNotation(UpLeft));
    }

    if (!(UpRight & TeamPieces) && !(UpRight & OppKing) && !isAttacked(UpRight, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces, colour)) {
        BBorCN ? Moves.push(UpRight) : Moves.push(BitboardToChessNotation(UpRight));
    }
  }

  if (!(Left & TeamPieces) && !(Left & OppKing) && !isAttacked(Left, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces, colour)) {
      BBorCN ? Moves.push(Left) : Moves.push(BitboardToChessNotation(Left));
  }

  if (!(Right & TeamPieces) && !(Right & OppKing) && !isAttacked(Right, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces, colour)) {
      BBorCN ? Moves.push(Right) : Moves.push(BitboardToChessNotation(Right));
  }

  if (!(Square.includes('1'))){
    if (!(DownLeft & TeamPieces) && !(DownLeft & OppKing) && !isAttacked(DownLeft, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces, colour)) {
        BBorCN ? Moves.push(DownLeft) : Moves.push(BitboardToChessNotation(DownLeft));
    }
  
    if (!(DownRight & TeamPieces) && !(DownRight & OppKing) && !isAttacked(DownRight, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces, colour)) {
        BBorCN ? Moves.push(DownRight) : Moves.push(BitboardToChessNotation(DownRight));
    }
  
    if (!(Down & TeamPieces) && !(Down & OppKing) && !isAttacked(Down, TeamPieces, OppRook, OppBishop, OppKnight, OppQueen, OppPawn, OpposingPieces, colour)) {
        BBorCN ? Moves.push(Down) : Moves.push(BitboardToChessNotation(Down));
    }
  }


  return Moves;
}
