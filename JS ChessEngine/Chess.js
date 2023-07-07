import {earlygamePST, endgamePST} from './PSTs.js';
console.log(earlygamePST);
console.log(endgamePST);


function GenerateBoard(){
    let t = 1;
    const board = document.querySelector('table');
    for (let i = 0 ; i < 8 ; i ++){
        const row = document.createElement('tr');
        row.id = (i+1).toString();
        board.appendChild(row);
        t++;
        for (let j = 0 ; j < 8 ; j ++){
            const tile = document.createElement('td');
            tile.setAttribute('type','Button');
            tile.id = row.id+(j+1).toString();
            tile.onclick = function(){
                if(tile.style.backgroundColor == 'rgb(255, 90, 90)' || tile.style.backgroundColor == 'rgb(255, 138, 138)'){
                    MakeMove(tile.id)
                }
                else{
                GetAvailableMoves(tile.id)
                }
            };
            if(t%2==0){
                tile.classList.add('white')
            }
            else
            {
                tile.classList.add('black')
            }
            row.appendChild(tile);
            t++;
        }
    }   
}

function WhiteBoardSetup(){
    var pawns = ['71','72','73','74','75','76','77','78'] // pawn ids
    var rooks = ['81','88'] // rook ids
    var knights = ['82','87'] // knight ids
    var bishops = ['83','86'] // bishop ids
    for(let i =0;i<8;i++){
        document.getElementById(pawns[i]).innerHTML = '♙'
    }
    for(let i =0;i<2;i++){
        document.getElementById(rooks[i]).innerHTML = '♖'
    }
    for(let i =0;i<2;i++){
        document.getElementById(knights[i]).innerHTML = '♘'
    }
    for(let i =0;i<2;i++){
        document.getElementById(bishops[i]).innerHTML = '♗'
    }
    document.getElementById('85').innerHTML = '♔'
    document.getElementById('84').innerHTML = '♕'
}

function BlackBoardSetup(){
    var pawns = ['21','22','23','24','25','26','27','28'] // pawn ids
    var rooks = ['11','18'] // rook ids
    var knights = ['12','17'] // knight ids
    var bishops = ['13','16'] // bishop ids
    for(let i =0;i<8;i++){
        document.getElementById(pawns[i]).innerHTML = '♟'
    }
    for(let i =0;i<2;i++){
        document.getElementById(rooks[i]).innerHTML = '♜'
    }
    for(let i =0;i<2;i++){
        document.getElementById(knights[i]).innerHTML = '♞'
    }
    for(let i =0;i<2;i++){
        document.getElementById(bishops[i]).innerHTML = '♝'
    }
    document.getElementById('15').innerHTML = '♚'
    document.getElementById('14').innerHTML = '♛'
}

function EvalBar(Percentage){
    document.getElementById('evalbar').style.background
     = 'linear-gradient(180deg,rgb(138, 138, 138) 0%, rgb(138, 138, 138) '
     +Percentage.toString()+'%,white '+Percentage.toString()+'%, white 100%)'
    }

//Displaying elements to user
GenerateBoard()
WhiteBoardSetup()
BlackBoardSetup()

//declaring global variables

var WhitePieces = [];
var BlackPieces = [];
var BoardDirection = true;
var selected = null;

var Board = [
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','','']
    ];

class Pawn {
    constructor(colour, rank, file) {
        if(colour == 'W'){
            this.pieceType = 'WPawn';
        }
        else{
            this.pieceType = 'BPawn';
        }
        this.colour = colour;
        this.rank = rank;
        this.file = file;
        this.moves = 0;
        this.CanBeEnPassanted = false;
        this.promote = false;
        Board[rank][file] = this;
    }
}

class Rook {
    constructor(colour, rank, file) {
        this.pieceType = 'Rook'
        this.colour = colour;
        this.rank = rank;
        this.file = file;
        this.CanCastle = true;
        Board[rank][file] = this;
    }
}

class Knight {
    constructor(colour, rank, file) {
        this.pieceType = 'Knight'
        this.colour = colour;
        this.rank = rank;
        this.file = file;
        Board[rank][file] = this;
    }
}

class Bishop {
    constructor(colour, rank, file) {
        this.pieceType = 'Bishop'
        this.colour = colour;
        this.rank = rank;
        this.file = file;
        Board[rank][file] = this;
    }
}

class Queen {
    constructor(colour, rank, file) {
        this.pieceType = 'Queen'
        this.colour = colour;
        this.rank = rank;
        this.file = file;
        Board[rank][file] = this;
    }
}

class King {
    constructor(colour, rank, file) {
        this.pieceType = 'King'
        this.colour = colour;
        this.rank = rank;
        this.file = file;
        Board[rank][file] = this;
        this.CanCastle = true;
        this.IsInCheck = false;
    }
}
function flipTable(){
    var table = document.querySelector('table');
    var rows = table.rows;
    var numRows = rows.length;
    var reverseRows = [];

    for(var i = numRows-1;i>=0;i--){
        reverseRows.push(rows[i]);
    }

    while(table.firstChild){
        table.removeChild(table.firstChild);
    }

    for(var i=0;i<numRows;i++){
        table.appendChild(reverseRows[i]);
    }
    BoardDirection = false;
}

function WPawnMoves(piece, rank, file){
    var PossibleMoves = [];
    if(piece.moves == 0){
            if(Board[rank-2][file] == '' & Board[rank-1][file] == ''){
                PossibleMoves.push([rank-2,file]);
            }
    }
    if(BlackPieces.includes(Board[rank-1][file+1])){
        PossibleMoves.push([rank-1,file+1]);
    }
    if(BlackPieces.includes(Board[rank-1][file-1])){
        PossibleMoves.push([rank-1,file-1]);
    }
    if(Board[rank-1][file] == ''){
        PossibleMoves.push([rank-1,file])
    }
    VisualiseMoves(PossibleMoves, rank, file);
    return PossibleMoves;
}

function BPawnMoves(piece, rank, file){
    var PossibleMoves = [];
    if(piece.moves == 0){
            if(Board[rank+2][file] == '' & Board[rank+1][file] == ''){
                PossibleMoves.push([rank+2,file]);
            }
    }
    if(WhitePieces.includes(Board[rank+1][file+1])){
        PossibleMoves.push([rank+1,file+1]);
    }
    if(WhitePieces.includes(Board[rank+1][file-1])){
        PossibleMoves.push([rank+1,file-1]);
    }
    if(Board[rank+1][file] == ''){
        PossibleMoves.push([rank+1,file])
    }
    VisualiseMoves(PossibleMoves, rank, file);
    return PossibleMoves;
}

function RookMoves(piece, rank, file){
    var PossibleMoves = [];
    if(piece.colour == 'W'){
        var oppColour = BlackPieces;
    }
    else{
        var oppColour = WhitePieces;
    }
    for(let i = 1;i<8;i++){
        try {
            if(Board[rank-i][file] == ''){
                PossibleMoves.push([rank-i,file])
            }
            else if(oppColour.includes(Board[rank-i][file])){
                PossibleMoves.push([rank-i,file])
                break;
            }
            else{
                break;
            } 
        } catch (TypeError) {
            break;
        }
    }
    for(let i = 1;i<8;i++){
        try {
            if(Board[rank+i][file] == ''){
                PossibleMoves.push([rank+i,file])
            }
            else if(oppColour.includes(Board[rank+i][file])){
                PossibleMoves.push([rank+i,file])
                break;
            }
            else{
                break;
            }
        } catch (TypeError) {
            break;
        }
    }
    for(let i = 1;i<8;i++){
        try {
            if(Board[rank][file-i] == ''){
                PossibleMoves.push([rank,file-i])
            }
            else if(oppColour.includes(Board[rank][file-i])){
                PossibleMoves.push([rank,file-i])
                break;
            }
            else{
                break;
            }
        } catch (TypeError) {
            break;
        }
    }
    for(let i = 1;i<8;i++){
        try {
            if(Board[rank][file+i] == ''){
                PossibleMoves.push([rank,file+i])
            }
            else if(oppColour.includes(Board[rank][file+i])){
                PossibleMoves.push([rank,file+i])
                break;
            }
            else{
                break;
            }
        } catch (TypeError) {
            break;
        }
    }
    VisualiseMoves(PossibleMoves, rank, file);
    return PossibleMoves;
}

function KnightMoves(piece,rank,file){ 
    let moves = [[rank+2,file+1],[rank+2,file-1],[rank+1,file+2],[rank-1,file+2],
                [rank-2,file+1],[rank-2,file-1],[rank+1,file-2],[rank-1,file-2]];
    let PossibleMoves = [];
    if(piece.colour == 'W'){
        var oppColour = BlackPieces;
    }
    else{
        var oppColour = WhitePieces;
    }
    let i = 0;
    while (i<8){
        try {
            if (Board[moves[i][0]][moves[i][1]] == '' || oppColour.includes(Board[moves[i][0]][moves[i][1]])){
                PossibleMoves.push([ moves[i][0],moves[i][1]]);
                i++
            }
            else{
                i++;
            }
        } catch (TypeError) {
            i++
            continue
        }
    }
    VisualiseMoves(PossibleMoves, rank, file);
    return PossibleMoves;
}

function BishopMoves(piece,rank,file){
    var PossibleMoves = [];
    if(piece.colour == 'W'){
        var oppColour = BlackPieces;
    }
    else{
        var oppColour = WhitePieces;
    }
    for(let i = 1;i<8;i++){
        try {
            if(Board[rank-i][file-i] == ''){
                PossibleMoves.push([rank-i,file-i])
            }
            else if(oppColour.includes(Board[rank-i][file-i])){
                PossibleMoves.push([rank-i,file-i])
                break;
            }
            else{
                break;
            } 
        } catch (TypeError) {
            break;
        }
    }
    for(let i = 1;i<8;i++){
        try {
            if(Board[rank+i][file+i] == ''){
                PossibleMoves.push([rank+i,file+i])
            }
            else if(oppColour.includes(Board[rank+i][file+i])){
                PossibleMoves.push([rank+i,file+i])
                break;
            }
            else{
                break;
            }
        } catch (TypeError) {
            break;
        }
    }
    for(let i = 1;i<8;i++){
        try {
            if(Board[rank+i][file-i] == ''){
                PossibleMoves.push([rank+i,file-i])
            }
            else if(oppColour.includes(Board[rank+i][file-i])){
                PossibleMoves.push([rank+i,file-i])
                break;
            }
            else{
                break;
            }
        } catch (TypeError) {
            break;
        }
    }
    for(let i = 1;i<8;i++){
        try {
            if(Board[rank-i][file+i] == ''){
                PossibleMoves.push([rank-i,file+i])
            }
            else if(oppColour.includes(Board[rank-i][file+i])){
                PossibleMoves.push([rank-i,file+i])
                break;
            }
            else{
                break;
            }
        } catch (TypeError) {
            break;
        }
    }
    VisualiseMoves(PossibleMoves, rank, file);
    return PossibleMoves;
}

function KingMoves(piece,rank,file){
    let moves = [[rank+1,file],[rank+1,file-1],[rank+1,file+1],[rank,file-1],[rank,file+1],[rank-1,file-1],[rank-1,file],[rank-1,file+1]]
    let PossibleMoves = [];
    if(piece.colour == 'W'){
        var oppColour = BlackPieces;
    }
    else{
        var oppColour = WhitePieces;
    }
    let i = 0;
    while (i<8){
        try {
            if (Board[moves[i][0]][moves[i][1]] == '' || oppColour.includes(Board[moves[i][0]][moves[i][1]])){
                PossibleMoves.push([moves[i][0],moves[i][1]]);
                i++
            }
            else{
                i++;
            }
        } catch (TypeError) {
            i++
            continue
        }
    }
    VisualiseMoves(PossibleMoves, rank, file);
    return PossibleMoves;
}

function QueenMoves(piece,rank,file){
    let PossibleMoves = [];
    let Kingmoves = KingMoves(piece,rank,file);
    let Rookmoves = RookMoves(piece,rank,file);
    let Bishopmoves = BishopMoves(piece,rank,file);
    for(let i=0;i<Rookmoves.length;i++){
        PossibleMoves.push(Rookmoves[i]);
    }
    for(let i=0;i<Bishopmoves.length;i++){
        PossibleMoves.push(Bishopmoves[i]);
    }
    VisualiseMoves(PossibleMoves, rank, file);
    return  PossibleMoves;
}

function VisualiseMoves(array, rank, file){
    for (let i = 0 ; i < 8 ; i ++){
        for (let j = 0 ; j < 8 ; j ++){
            var d = document.getElementById((i+1).toString()+(j+1).toString());
            var e = d.classList;
            if(e[0] == 'white'){
                var f = 'rgb(255, 255, 255)'
            }
            else{
                var f = 'rgb(138, 138, 138)'
            }
            d.style.backgroundColor = f;
        }
    }
    rank+=1;
    file+=1;
    selected = document.getElementById(rank.toString()+file.toString());
    selected.style.backgroundColor = 'rgb(255,0,0)';
    for(let i=0;i<array.length;i++){
        var id = (array[i][0]+1).toString()+(array[i][1]+1).toString();
        var a = document.getElementById(id)
        var b = a.classList;
        if(b[0] == 'white'){
            var c = 'rgb(255, 138, 138)'
        }
        else{
            var c = 'rgb(255, 90, 90)'
        }
        a.style.backgroundColor = c;
    }
}


function GetAvailableMoves(id){
    var tile = document.getElementById(id);
    let rank = parseInt(id[0])-1
    let file = parseInt(id[1])-1
    let piece = Board[rank][file];
    if(piece != undefined){
        switch(piece.pieceType){
            case 'WPawn':
                console.log(WPawnMoves(piece, rank, file));
                break;
            case 'BPawn':
                console.log(BPawnMoves(piece, rank, file));
                break;
            case 'Rook':
                console.log(RookMoves(piece, rank, file));
                break;
            case 'Knight':
                console.log(KnightMoves(piece, rank, file));
                break;
            case 'Bishop':
                console.log(BishopMoves(piece, rank, file));
                break;
            case 'Queen':
                console.log(QueenMoves(piece,rank,file))
                break;
            case 'King':
                console.log(KingMoves(piece,rank,file))
                break;
        }
    }
    console.log(Board[rank][file],rank,file)
}

function MakeMove(id){
    for (let i = 0 ; i < 8 ; i ++){
        for (let j = 0 ; j < 8 ; j ++){
            var d = document.getElementById((i+1).toString()+(j+1).toString());
            var e = d.classList;
            if(e[0] == 'white'){
                var f = 'rgb(255, 255, 255)'
            }
            else{
                var f = 'rgb(138, 138, 138)'
            }
            d.style.backgroundColor = f;
        }
    }
    document.getElementById(id).innerHTML = selected.innerHTML;
    selected.innerHTML = '';
    var piece = Board[parseInt(selected.id[0]-1)][parseInt(selected.id[1]-1)];
    Board[parseInt(id[0]-1)][parseInt(id[1]-1)] = piece;
    Board[parseInt(selected.id[0]-1)][parseInt(selected.id[1]-1)] = '';
    console.log(Board);
}
function Game(){
//White pieces
    var WPawn1 = new Pawn('W',1,0);
    var WPawn2 = new Pawn('W',1,1);
    var WPawn3 = new Pawn('W',1,2);
    var WPawn4 = new Pawn('W',1,3);
    var WPawn5 = new Pawn('W',1,4);
    var WPawn6 = new Pawn('W',1,5);
    var WPawn7 = new Pawn('W',1,6);
    var WPawn8 = new Pawn('W',1,7);

    var WRook1 = new Rook('W',0,0);
    var WRook2 = new Rook('W',0,7);

    var WKnight1 = new Knight('W',0,1);
    var WKnight2 = new Knight('W',0,6);

    var WBishop1 = new Bishop('W',0,2);
    var WBishop2 = new Bishop('W',0,5);

    var WQueen1 = new Queen('W',0,3);
    var WKing1 = new King('W',0,4);

    WhitePieces.push(WPawn1,WPawn2,WPawn3,WPawn4,WPawn5,WPawn6,WPawn7,WPawn8
        ,WRook1,WRook2,WKnight1,WKnight2,WBishop1,WBishop2,WQueen1,WKing1)

    //Black pieces
    var BPawn1 = new Pawn('B',6,0);
    var BPawn2 = new Pawn('B',6,1);
    var BPawn3 = new Pawn('B',6,2);
    var BPawn4 = new Pawn('B',6,3);
    var BPawn5 = new Pawn('B',6,4);
    var BPawn6 = new Pawn('B',6,5);
    var BPawn7 = new Pawn('B',6,6);
    var BPawn8 = new Pawn('B',6,7);

    var BRook1 = new Rook('B',7,0);
    var BRook2 = new Rook('B',7,7);

    var BKnight1 = new Knight('B',7,1);
    var BKnight2 = new Knight('B',7,6);

    var BBishop1 = new Bishop('B',7,2);
    var BBishop2 = new Bishop('B',7,5);

    var BQueen1 = new Queen('B',7,3);
    var BKing1 = new King('B',7,4);

    BlackPieces.push(BPawn1,BPawn2,BPawn3,BPawn4,BPawn5,BPawn6,BPawn7,BPawn8
        ,BRook1,BRook2,BKnight1,BKnight2,BBishop1,BBishop2,BQueen1,BKing1)

    Board = Board.reverse();
    console.log(Board);
}
Game();
flipTable();