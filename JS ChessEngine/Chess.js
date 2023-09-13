import {earlygamePST, endgamePST} from './PSTs.js';
console.log(earlygamePST);
console.log(endgamePST);

var turn = 1;
const WPieces = ['♙','♖','♘','♗','♔','♕'];
const BPieces = ['♟','♜','♞','♝','♚','♛'];
var start_timer = false

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
                    if(turn % 2 === 0){
                        if(BPieces.includes(selected.innerHTML)){
                            MakeMove(tile.id)
                        }
                    }
                    else{
                        if(WPieces.includes(selected.innerHTML)){
                            MakeMove(tile.id)
                        }
                    }
                }
                else if(turn % 2 === 0){
                    if(BPieces.includes(tile.innerHTML)){
                        GetAvailableMoves(tile.id,Board)
                    }
                }
                else{
                    if(WPieces.includes(tile.innerHTML)){
                        GetAvailableMoves(tile.id,Board)
                    }
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


function EvalBar(){
    var WTotal = 0
    var BTotal = 0
    for(let i =0;i<WhitePieces.length;i++){
        WTotal = WTotal+WhitePieces[i].value - 100000
    }
    for(let i =0;i<BlackPieces.length;i++){
        BTotal = BTotal+BlackPieces[i].value - 100000
    }
    var Total = WTotal+BTotal;
    var Percentage = (BTotal/Total)*100;
    var evalbar = document.getElementById('evalbar')
    evalbar.style.background
     = 'linear-gradient(180deg,rgb(138, 138, 138) 0%, rgb(138, 138, 138) '
     +Percentage.toString()+'%,white '+Percentage.toString()+'%, white 100%)'
    var evalscore = Math.round(Percentage - 50.0);
    evalbar.innerHTML = evalscore.toString();
    }

//Displaying elements to user
GenerateBoard()

//declaring global variables

var WhitePieces = [];
var BlackPieces = [];
var BoardDirection = true;
var selected = null;
var BoardSelectedRank = null;
var BoardSelectedFile = null;
var WKingRank = 7
var WKingFile = 4
var BKingRank = 0
var BKingFile = 4
var PreWKingRank = 7
var PreWKingFile = 4
var PreBKingRank = 0
var PreBKingFile = 4
var CheckingPiece
var CheckingRank
var CheckingFile

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
        this.moves = 0;
        this.CanBeEnPassanted = false;
        Board[rank][file] = this;
        this.value = 1;
        if(colour == 'W'){
            this.pieceText = '♙'
        }
        else{
            this.pieceText = '♟'
        }
    }
}

class Rook {
    constructor(colour, rank, file) {
        this.pieceType = 'Rook'
        this.colour = colour;
        this.CanCastle = true;
        Board[rank][file] = this;
        this.value = 5;
        if(colour == 'W'){
            this.pieceText = '♖'
        }
        else{
            this.pieceText = '♜'
        }
    }
}

class Knight {
    constructor(colour, rank, file) {
        this.pieceType = 'Knight'
        this.colour = colour;
        Board[rank][file] = this;
        this.value = 3;
        if(colour == 'W'){
            this.pieceText = '♘'
        }
        else{
            this.pieceText = '♞'
        }
    }
}

class Bishop {
    constructor(colour, rank, file) {
        this.pieceType = 'Bishop'
        this.colour = colour;
        Board[rank][file] = this;
        this.value = 3;
        if(colour == 'W'){
            this.pieceText = '♗'
        }
        else{
            this.pieceText = '♝'
        }
    }
}

class Queen {
    constructor(colour, rank, file) {
        this.pieceType = 'Queen'
        this.colour = colour;
        Board[rank][file] = this;
        this.value = 9;
        if(colour == 'W'){
            this.pieceText = '♕'
        }
        else{
            this.pieceText = '♛'
        }
    }
}

class King {
    constructor(colour, rank, file) {
        this.pieceType = 'King'
        this.colour = colour;
        Board[rank][file] = this;
        this.CanCastle = true;
        this.IsInCheck = false;
        this.value = 100000;
        if(colour == 'W'){
            this.pieceText = '♔'
        }
        else{
            this.pieceText = '♚'
        }
    }
}
function flipTable(){
    Board = Board.reverse();
    for(let i=0;i<Board.length;i++){
        Board[i] = Board[i].reverse();
    }
    UpdateDisplayBoard();
    if(BoardDirection==true){
        BoardDirection = false;
    }
    else{
        BoardDirection = true;
    }
    UpdateKingPos();
}

function UpdateKingPos(){
    for (let i = 0 ; i < 8 ; i ++){
        for (let j = 0 ; j < 8 ; j ++){
            if(Board[i][j] != '' && Board[i][j].pieceType == 'King'){
                if(Board[i][j].colour == 'W'){
                    WKingRank = i;
                    WKingFile = j;
                }
                else{
                    BKingRank = i;
                    BKingFile = j;
                }
            }
        }
    }
}

function WPawnMoves(Board, piece, rank, file, isVisualising){
    var PossibleMoves = [];
    if(BoardDirection == true){
        try{
            if(piece.moves == 0){
                    if(Board[rank-2][file] == '' & Board[rank-1][file] == ''){
                        PossibleMoves.push([rank-2,file]);
                    }
            }
        }
        catch{
            console.log('pawn checking out of board');
        }
        try{
            if(BlackPieces.includes(Board[rank-1][file+1])){
                PossibleMoves.push([rank-1,file+1]);
            }
        }
        catch (TypeError){
            console.log('pawn checking out of board');
        }
        try{
            if(BlackPieces.includes(Board[rank-1][file-1])){
                PossibleMoves.push([rank-1,file-1]);
            }
        }
        catch (TypeError){
            console.log('pawn checking out of board');
        }
        try{
            if(Board[rank-1][file] == ''){
                PossibleMoves.push([rank-1,file])
            }
        }
        catch{
            console.log('pawn checking out of board');
        }
        try{
            if(Board[rank][file-1].pieceType == 'BPawn' && Board[rank][file-1].CanBeEnPassanted == true){
                PossibleMoves.push([rank-1,file-1])
            }
        }
        catch{
            console.log('no en passant available here')
        }
        try{
            if(Board[rank][file+1].pieceType == 'BPawn' && Board[rank][file+1].CanBeEnPassanted == true){
                PossibleMoves.push([rank-1,file+1])
            }
        }
        catch{
            console.log('no en passant available here')
        }
    }
    else{
        try{
            if(piece.moves == 0){
                    if(Board[rank+2][file] == '' & Board[rank+1][file] == ''){
                        PossibleMoves.push([rank+2,file]);
                    }
            }
        }
        catch{
            console.log('pawn checking out of board');
        }
        try{
            if(BlackPieces.includes(Board[rank+1][file-1])){
                PossibleMoves.push([rank+1,file-1]);
            }
        }
        catch (TypeError){
            console.log('pawn checking out of board');
        }
        try{
            if(BlackPieces.includes(Board[rank+1][file+1])){
                PossibleMoves.push([rank+1,file+1]);
            }
        }
        catch (TypeError){
            console.log('pawn checking out of board');
        }
        try{
            if(Board[rank+1][file] == ''){
                PossibleMoves.push([rank+1,file])
            }
        }
        catch{
            console.log('pawn checking out of board');
        }
        try{
            if(Board[rank][file+1].pieceType == 'BPawn' && Board[rank][file+1].CanBeEnPassanted == true){
                PossibleMoves.push([rank+1,file+1])
            }
        }
        catch{
            console.log('no en passant available here')
        }
        try{
            if(Board[rank][file-1].pieceType == 'BPawn' && Board[rank][file-1].CanBeEnPassanted == true){
                PossibleMoves.push([rank+1,file-1])
            }
        }
        catch{
            console.log('no en passant available here')
        }
    }
    if(isVisualising){
        VisualiseMoves(PossibleMoves, rank, file);
    }
    return PossibleMoves;
}

function BPawnMoves(Board, piece, rank, file, isVisualising){
    var PossibleMoves = [];
    if(BoardDirection == false){
        try{
            if(piece.moves == 0){
                    if(Board[rank-2][file] == '' & Board[rank-1][file] == ''){
                        PossibleMoves.push([rank-2,file]);
                    }
            }
        }
        catch{
            console.log('pawn checking out of board');
        }
        try{
            if(WhitePieces.includes(Board[rank-1][file+1])){
                PossibleMoves.push([rank-1,file+1]);
            }
        }
        catch (TypeError){
            console.log('pawn checking out of board');
        }
        try{
            if(WhitePieces.includes(Board[rank-1][file-1])){
                PossibleMoves.push([rank-1,file-1]);
            }
        }
        catch (TypeError){
            console.log('pawn checking out of board');
        }
        try{
            if(Board[rank-1][file] == ''){
                PossibleMoves.push([rank-1,file])
            }
        }
        catch{
            console.log('pawn checking out of board');
        }
        try{
            if(Board[rank][file-1].pieceType == 'WPawn' && Board[rank][file-1].CanBeEnPassanted == true){
                PossibleMoves.push([rank-1,file-1])
            }
        }
        catch{
            console.log('no en passant available here')
        }
        try{
            if(Board[rank][file+1].pieceType == 'WPawn' && Board[rank][file+1].CanBeEnPassanted == true){
                PossibleMoves.push([rank-1,file+1])
            }
        }
        catch{
            console.log('no en passant available here')
        }
    }
    else{
        try{
            if(piece.moves == 0){
                    if(Board[rank+2][file] == '' & Board[rank+1][file] == ''){
                        PossibleMoves.push([rank+2,file]);
                    }
            }
        }
        catch{
            console.log('pawn checking out of board');
        }
        try{
            if(WhitePieces.includes(Board[rank+1][file-1])){
                PossibleMoves.push([rank+1,file-1]);
            }
        }
        catch (TypeError){
            console.log('pawn checking out of board');
        }
        try{
            if(WhitePieces.includes(Board[rank+1][file+1])){
                PossibleMoves.push([rank+1,file+1]);
            }
        }
        catch (TypeError){
            console.log('pawn checking out of board');
        }
        try{
            if(Board[rank+1][file] == ''){
                PossibleMoves.push([rank+1,file])
            }
        }
        catch{
            console.log('pawn checking out of board');
        }
        try{
            if(Board[rank][file+1].pieceType == 'WPawn' && Board[rank][file+1].CanBeEnPassanted == true){
                PossibleMoves.push([rank+1,file+1])
            }
        }
        catch{
            console.log('no en passant available here')
        }
        try{
            if(Board[rank][file-1].pieceType == 'WPawn' && Board[rank][file-1].CanBeEnPassanted == true){
                PossibleMoves.push([rank+1,file-1])
            }
        }
        catch{
            console.log('no en passant available here')
        }
    }
    if(isVisualising){
        VisualiseMoves(PossibleMoves, rank, file);
    }
    return PossibleMoves;
}

function RookMoves(Board, piece, rank, file, isVisualising){
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
    if(isVisualising){
        VisualiseMoves(PossibleMoves, rank, file);
    }
    return PossibleMoves;
}

function KnightMoves(Board, piece,rank,file, isVisualising){ 
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
    if(isVisualising){
        VisualiseMoves(PossibleMoves, rank, file);
    }
    return PossibleMoves;
}

function BishopMoves(Board, piece,rank,file, isVisualising){
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
    if(isVisualising){
        VisualiseMoves(PossibleMoves, rank, file);
    }
    return PossibleMoves;
}

function KingMoves(Board, piece,rank,file){
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
    try{
        if(piece.CanCastle== true && Board[rank][file+1] == '' && Board[rank][file+2] == '' && Board[rank][file+3].CanCastle==true){
            PossibleMoves.push([rank,file+2])
        }
    }
    catch(TypeError){
        console.log('cannot castle here')
    }
    try{
        if(piece.CanCastle== true && Board[rank][file-1] == '' && Board[rank][file-2] == '' && Board[rank][file-3] == '' && Board[rank][file-4].CanCastle==true){
            PossibleMoves.push([rank,file-2])
        }
    }
    catch(TypeError){
        console.log('cannot castle here')
    }
    VisualiseMoves(PossibleMoves, rank, file);
    return PossibleMoves;
}

function QueenMoves(Board, piece,rank,file, isVisualising){
    let PossibleMoves = [];
    let Rookmoves = RookMoves(Board, piece,rank,file);
    let Bishopmoves = BishopMoves(Board, piece,rank,file);
    for(let i=0;i<Rookmoves.length;i++){
        PossibleMoves.push(Rookmoves[i]);
    }
    for(let i=0;i<Bishopmoves.length;i++){
        PossibleMoves.push(Bishopmoves[i]);
    }
    if(isVisualising){
        VisualiseMoves(PossibleMoves, rank, file);
    }
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
    BoardSelectedRank = rank;
    BoardSelectedFile = file;
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


function GetAvailableMoves(id,Board){
    var tile = document.getElementById(id);
    let rank = parseInt(id[0])-1
    let file = parseInt(id[1])-1
    let piece = Board[rank][file];
    if(piece != undefined){
        switch(piece.pieceType){
            case 'WPawn':
                return(WPawnMoves(Board, piece, rank, file, true));
            case 'BPawn':
                return(BPawnMoves(Board, piece, rank, file, true));
            case 'Rook':
                return(RookMoves(Board, piece, rank, file, true));
            case 'Knight':
                return(KnightMoves(Board, piece, rank, file, true));
            case 'Bishop':
                return(BishopMoves(Board, piece, rank, file, true));
            case 'Queen':
                return(QueenMoves(Board, piece,rank,file, true))
            case 'King':
                return(KingMoves(Board, piece,rank,file))
        }
    }
    console.log(Board[rank][file],rank,file)
}

function MakeMove(id){
    var rank = parseInt(id[0]-1);
    var file = parseInt(id[1]-1);
    var piece = Board[BoardSelectedRank-1][BoardSelectedFile-1];
    var BoardCopy = JSON.parse(JSON.stringify(Board));
    if(piece.pieceType == 'WPawn' || piece.pieceType == 'BPawn'){
        piece.moves+=1
        if(piece.pieceType == 'WPawn' && (rank == 4 || rank == 3) && piece.moves == 1){
            piece.CanBeEnPassanted = true;
        }
        else if(piece.pieceType == 'BPawn' && (rank == 4 || rank == 3) && piece.moves == 1){
            piece.CanBeEnPassanted = true;
        }
        else{
            piece.CanBeEnPassanted = false;
        }
        if(BoardDirection == true){
            if(Board[rank][file] == '' && BoardSelectedFile-1 != file && piece.pieceType == 'WPawn'){
                Board[rank+1][file] = ''
            }
            else if(Board[rank][file] == '' && BoardSelectedFile-1 != file && piece.pieceType == 'BPawn'){
                Board[rank-1][file] = ''
            }
        }
        else{
            if(Board[rank][file] == '' && BoardSelectedFile-1 != file && piece.pieceType == 'WPawn'){
                Board[rank-1][file] = ''
            }
            else if(Board[rank][file] == '' && BoardSelectedFile-1 != file && piece.pieceType == 'BPawn'){
                Board[rank+1][file] = ''
            }
        }
    }
    Board[rank][file] = piece;
    Board[BoardSelectedRank-1][BoardSelectedFile-1] = '';
    if(piece.pieceType == 'WPawn' || piece.pieceType == 'BPawn'){
        checkPawnPromotion(rank,file);
    }
    if(piece.pieceType == 'King'){
        if((rank == 0 || rank == 7) && (file == 6) && piece.CanCastle == true){
            var r = Board[rank][file+1]
            Board[rank][file+1] = '';
            Board[rank][file-1] = r;
            Board[rank][file-1].CanCastle = false;
        }
        else if((rank == 0 || rank == 7) && (file == 2) && piece.CanCastle == true){
            var r = Board[rank][file-2]
            Board[rank][file-2] = '';
            Board[rank][file+1] = r;
            Board[rank][file+1].CanCastle = false;
        }
        piece.CanCastle = false;
        if(piece.colour == 'W'){
            PreWKingRank = WKingRank;
            PreWKingFile = WKingFile;
            WKingRank = rank;
            WKingFile = file;
        }
        else{
            PreBKingRank = BKingRank;
            PreBKingFile = BKingFile;
            BKingRank = rank;
            BKingFile = file;
        }
    }
    if(CheckCheck(Board,rank,file)){
        Board = JSON.parse(JSON.stringify(BoardCopy));
        UpdatePieceCollections();
        if(piece.pieceType == 'King'){
            if(piece.colour == 'W'){
                WKingRank = PreWKingRank;
                WKingFile = PreWKingFile;
            }
            else{
                BKingRank = PreBKingRank;
                BKingFile = PreBKingFile;
            }
        }
        return
    }
    if(piece.colour == 'W'){
        var c = 'B'
        var o = 'White'
        var r = BKingRank
        var f = BKingFile
    }
    else{
        var c = 'W'
        var o = 'Black'
        var r = WKingRank
        var f = WKingFile
    }
    console.log(Board);
    UpdatePieceCollections();
    UpdateDisplayBoard();
    if(turn % 2 == 0){
        startWhiteTimer()
        stopBlackTimer()
    }
    else{
        startBlackTimer()
        stopWhiteTimer()
    }
    if(CheckCheck(Board,r,f)){
        if(CheckCheckmate(c)){
            winner(o)
        }  
    }
    turn++;
}

function checkPawnPromotion(rank,file){
    if(rank == 0 || rank == 7){
        var piece = Board[rank][file];
        if(piece.pieceType == 'WPawn'){
            var colour = 'W';
            var PieceCollection = WhitePieces;
        }
        else{
            var colour = 'B';
            var PieceCollection = BlackPieces;
        }
        var QueenPromotion = new Queen(colour,rank,file);
        Board[rank][file] = QueenPromotion;
        if(piece.colour == 'W'){
            WhitePieces.push(QueenPromotion);
        }
        else{
            BlackPieces.push(QueenPromotion);
        }
    }
}

function UpdatePieceCollections(){
    WhitePieces = []
    BlackPieces = []
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(Board[i][j] != ''){
                if(Board[i][j].colour == 'W'){
                    WhitePieces.push(Board[i][j]);
                }
                else{
                    BlackPieces.push(Board[i][j]);
                }
            }
        }
    }
    EvalBar();
}

function UpdateDisplayBoard(){
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
    for(let i=1;i<9;i++){
        for(let j=1;j<9;j++){
            if(text = Board[i-1][j-1].pieceText == undefined){
                var id = (i.toString())+(j.toString())
                document.getElementById(id).innerHTML = '';
            }
            else{
                var id = (i.toString())+(j.toString())
                var text = Board[i-1][j-1].pieceText;
                document.getElementById(id).innerHTML = text;
            }
        }
    }
}

function CanCheckBeBlocked(rank,file,piece){
    var AMoves = [];
    if(piece.colour == 'W'){
        var KingRank = BKingRank;
        var KingFile = BKingFile;
    }
    else{
        var KingRank = WKingRank;
        var KingFile = WKingFile;
    }
    var KingPos = [KingRank,KingFile]
    var Moves
    switch(piece.pieceType){
        case 'WPawn':
            Moves = (WPawnMoves(Board, piece, rank, file, false));
        case 'BPawn':
            Moves = (BPawnMoves(Board, piece, rank, file, false));
        case 'Rook':
            Moves = (RookMoves(Board, piece, rank, file, false));
        case 'Knight':
            Moves = (KnightMoves(Board, piece, rank, file, false));
        case 'Bishop':
            Moves = (BishopMoves(Board, piece, rank, file, false));
        case 'Queen':
            Moves = (QueenMoves(Board, piece,rank,file, false))
    }
    for(let i=0;i<Moves.length;i++){
        if(Moves[i][0] == KingPos[0] && Moves[i][1] == KingPos[1]){
            continue;
        
        }
        else{
            // filter down list to moves that result in check then check if those moves are attacked
            var CheckBoard = JSON.parse(JSON.stringify(Board)) ;
            CheckBoard[Moves[i][0]][Moves[i][1]] = piece;
            CheckBoard[CheckingRank][CheckingFile] = '';
            if(ACheckCheck(CheckBoard,Moves[i][0],Moves[i][1])){
                AMoves.push(Moves);
            }
        }
    }
    return false
}

function IsAttacked(rank,file,piece){
    if(piece.colour == 'W'){
        var oppColour = 'B'
        var pawn = 'WPawn'
    }
    else{
        var oppColour = 'W'
        var pawn = 'BPawn'
    }
    // Check for each piece as the piece from the king pos, etc check knight moves from king pos and check if the opp knight is in the possible moves.
    var PossibleBishopMoves = BishopMoves(Board,piece,rank,file, false);
    for(let i = 0;i<PossibleBishopMoves.length;i++){
        if(Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]] != '' && (Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].pieceType == 'Bishop' || Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].pieceType == 'Queen')&& Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].colour == oppColour){ 
            return true;
        }
    }
    var PossibleRookMoves = RookMoves(Board,piece,rank,file, false);
    for(let i = 0;i<PossibleRookMoves.length;i++){
        if(Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]] != '' && (Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].pieceType == 'Rook' || Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].pieceType == 'Queen')&& Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].colour == oppColour){ 
            return true;
        }
    }
    var PossibleKnightMoves = KnightMoves(Board,piece,rank,file, false)
    for(let i = 0;i<PossibleKnightMoves.length;i++){
        if(Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]] != '' && Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]].pieceType == 'Knight'&& Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]].colour == oppColour){ 
            return true;
        }
    }
    if(pawn = 'WPawn'){
        var PossibleWPawnMoves = WPawnMoves(Board,piece,rank,file, false)
        for(let i = 0;i<PossibleWPawnMoves.length;i++){
            if(Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]] != '' && Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]].pieceType == 'BPawn'){ 
                return true;
            }
        }
    }
    else{
        var PossibleBPawnMoves = BPawnMoves(Board,piece,rank,file, false)
        for(let i = 0;i<PossibleBPawnMoves.length;i++){
            if(Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]] != '' && Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]].pieceType == 'WPawn'){ 
                return true;
            }
        }
    }
    return false;
}

function CheckCheck(Board,rank,file){
    if(Board[rank][file].colour == 'W'){
        var KingRank = WKingRank;
        var KingFile = WKingFile;
        var oppColour = 'B'
        var pawn = 'WPawn'
    }
    else{
        var KingRank = BKingRank;
        var KingFile = BKingFile;
        var oppColour = 'W'
        var pawn = 'BPawn'
    }
    // Check for each piece as the piece from the king pos, etc check knight moves from king pos and check if the opp knight is in the possible moves.
    var PossibleBishopMoves = BishopMoves(Board,Board[rank][file],KingRank,KingFile, false);
    for(let i = 0;i<PossibleBishopMoves.length;i++){
        if(Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]] != '' && (Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].pieceType == 'Bishop' || Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].pieceType == 'Queen')&& Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].colour == oppColour){ 
            CheckingPiece = Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]]
            CheckingRank = PossibleBishopMoves[i][0]
            CheckingFile = PossibleBishopMoves[i][1]
            return true;
        }
    }
    var PossibleRookMoves = RookMoves(Board,Board[rank][file],KingRank,KingFile, false);
    for(let i = 0;i<PossibleRookMoves.length;i++){
        if(Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]] != '' && (Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].pieceType == 'Rook' || Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].pieceType == 'Queen')&& Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].colour == oppColour){ 
            CheckingPiece = Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]]
            CheckingRank = PossibleRookMoves[i][0]
            CheckingFile = PossibleRookMoves[i][1]
            return true;
        }
    }
    var PossibleKnightMoves = KnightMoves(Board,Board[rank][file],KingRank,KingFile, false)
    for(let i = 0;i<PossibleKnightMoves.length;i++){
        if(Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]] != '' && Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]].pieceType == 'Knight'&& Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]].colour == oppColour){ 
            CheckingPiece = Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]]
            CheckingRank = PossibleKnightMoves[i][0]
            CheckingFile = PossibleKnightMoves[i][1]
            return true;
        }
    }
    if(pawn == 'WPawn'){
        var PossibleWPawnMoves = WPawnMoves(Board,Board[rank][file],KingRank,KingFile, false)
        for(let i = 0;i<PossibleWPawnMoves.length;i++){
            if(Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]] != '' && Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]].pieceType == 'BPawn'){ 
                CheckingPiece = Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]]
                CheckingRank = PossibleWPawnMoves[i][0]
                CheckingFile = PossibleWPawnMoves[i][1]
                return true;
            }
        }
    }
    else{
        var PossibleBPawnMoves = BPawnMoves(Board,Board[rank][file],KingRank,KingFile, false)
        for(let i = 0;i<PossibleBPawnMoves.length;i++){
            if(Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]] != '' && Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]].pieceType == 'WPawn'){ 
                CheckingPiece = Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]]
                CheckingRank = PossibleBPawnMoves[i][0]
                CheckingFile = PossibleBPawnMoves[i][1]
                return true;
            }
        }
    }
    return false;
}

function ACheckCheck(Board,rank,file){
    if(Board[rank][file].colour == 'W'){
        var KingRank = WKingRank;
        var KingFile = WKingFile;
        var oppColour = 'B'
        var pawn = 'WPawn'
    }
    else{
        var KingRank = BKingRank;
        var KingFile = BKingFile;
        var oppColour = 'W'
        var pawn = 'BPawn'
    }
    // Check for each piece as the piece from the king pos, etc check knight moves from king pos and check if the opp knight is in the possible moves.
    var PossibleBishopMoves = BishopMoves(Board,Board[rank][file],KingRank,KingFile, false);
    for(let i = 0;i<PossibleBishopMoves.length;i++){
        if(Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]] != '' && (Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].pieceType == 'Bishop' || Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].pieceType == 'Queen')&& Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].colour == oppColour){ 
            CheckingPiece = Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]]
            CheckingRank = PossibleBishopMoves[i][0]
            CheckingFile = PossibleBishopMoves[i][1]
            return true;
        }
    }
    var PossibleRookMoves = RookMoves(Board,Board[rank][file],KingRank,KingFile, false);
    for(let i = 0;i<PossibleRookMoves.length;i++){
        if(Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]] != '' && (Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].pieceType == 'Rook' || Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].pieceType == 'Queen')&& Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].colour == oppColour){ 
            CheckingPiece = Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]]
            CheckingRank = PossibleRookMoves[i][0]
            CheckingFile = PossibleRookMoves[i][1]
            return true;
        }
    }
    var PossibleKnightMoves = KnightMoves(Board,Board[rank][file],KingRank,KingFile, false)
    for(let i = 0;i<PossibleKnightMoves.length;i++){
        if(Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]] != '' && Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]].pieceType == 'Knight'&& Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]].colour == oppColour){ 
            CheckingPiece = Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]]
            CheckingRank = PossibleKnightMoves[i][0]
            CheckingFile = PossibleKnightMoves[i][1]
            return true;
        }
    }
    if(pawn == 'WPawn'){
        var PossibleWPawnMoves = WPawnMoves(Board,Board[rank][file],KingRank,KingFile, false)
        for(let i = 0;i<PossibleWPawnMoves.length;i++){
            if(Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]] != '' && Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]].pieceType == 'BPawn'){ 
                CheckingPiece = Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]]
                CheckingRank = PossibleWPawnMoves[i][0]
                CheckingFile = PossibleWPawnMoves[i][1]
                return true;
            }
        }
    }
    else{
        var PossibleBPawnMoves = BPawnMoves(Board,Board[rank][file],KingRank,KingFile, false)
        for(let i = 0;i<PossibleBPawnMoves.length;i++){
            if(Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]] != '' && Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]].pieceType == 'WPawn'){ 
                CheckingPiece = Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]]
                CheckingRank = PossibleBPawnMoves[i][0]
                CheckingFile = PossibleBPawnMoves[i][1]
                return true;
            }
        }
    }
    return false;
}


function CheckCheckmate(colour){
    if(colour == 'W'){
        var KingRank = WKingRank;
        var KingFile = WKingFile;
        var oppColour = 'B'
        var pawn = 'WPawn'
    }
    else{
        var KingRank = BKingRank;
        var KingFile = BKingFile;
        var oppColour = 'W'
        var pawn = 'BPawn'
    }
    var Moves = KingMoves(Board, Board[KingRank][KingFile], KingRank, KingFile);
    var MovesLength = Moves.length;
    for(let i = 0; i<Moves.length;i++){
        var PossibleBishopMoves = BishopMoves(Board,Board[KingRank][KingFile],Moves[i][0],Moves[i][1], false);
        for(let i = 0;i<PossibleBishopMoves.length;i++){
            if(Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]] != '' && (Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].pieceType == 'Bishop' || Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].pieceType == 'Queen')&& Board[PossibleBishopMoves[i][0]][PossibleBishopMoves[i][1]].colour == oppColour){ 
                MovesLength--;
                break;
            }
        }
        var PossibleRookMoves = RookMoves(Board,Board[KingRank][KingFile],Moves[i][0],Moves[i][1], false);
        for(let i = 0;i<PossibleRookMoves.length;i++){
            if(Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]] != '' && (Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].pieceType == 'Rook' || Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].pieceType == 'Queen')&& Board[PossibleRookMoves[i][0]][PossibleRookMoves[i][1]].colour == oppColour){ 
                MovesLength--;
                break;
            }
        }
        var PossibleKnightMoves = KnightMoves(Board,Board[KingRank][KingFile],Moves[i][0],Moves[i][1], false)
        for(let i = 0;i<PossibleKnightMoves.length;i++){
            if(Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]] != '' && Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]].pieceType == 'Knight'&& Board[PossibleKnightMoves[i][0]][PossibleKnightMoves[i][1]].colour == oppColour){ 
                MovesLength--;
                break;
            }
        }
        if(pawn = 'WPawn'){
            var PossibleWPawnMoves = WPawnMoves(Board,Board[KingRank][KingFile],Moves[i][0],Moves[i][1], false)
            for(let i = 0;i<PossibleWPawnMoves.length;i++){
                if(Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]] != '' && Board[PossibleWPawnMoves[i][0]][PossibleWPawnMoves[i][1]].pieceType == 'BPawn'){ 
                    MovesLength--;
                    break;
                }
            }
        }
        else{
            var PossibleBPawnMoves = BPawnMoves(Board,Board[KingRank][KingFile],Moves[i][0],Moves[i][1], false)
            for(let i = 0;i<PossibleBPawnMoves.length;i++){
                if(Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]] != '' && Board[PossibleBPawnMoves[i][0]][PossibleBPawnMoves[i][1]].pieceType == 'WPawn'){ 
                    MovesLength--;
                    break;
                }
            }
        }
    }
    if(MovesLength <= 0){
        if(IsAttacked(CheckingRank,CheckingFile,CheckingPiece) || CanCheckBeBlocked(CheckingRank,CheckingFile,CheckingPiece)){
            return false
        }
        else{
            return true
        }
    }
}
    
function winner(colour){
    document.getElementById('Winner').innerHTML = 'Winner: '+colour.toString()
    document.getElementById('Winner').style.visibility = 'visible'
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
var w
var wtime
function startWhiteTimer(){
    w = new Worker('WhiteTimer.js');
    w.addEventListener('message', function(event) {
      document.getElementById('WhiteTimer').innerHTML = event.data;
        wtime = event.data

    }
    );
    if(document.getElementById('WhiteTimer').innerHTML == '10:00'){
        w.postMessage('10:00')
    }
    else{
        w.postMessage(wtime)
    }
}

function stopWhiteTimer(){
    if(w!= undefined){
        w.terminate();
        w = undefined;
    }
}
var b
var btime
function startBlackTimer(){
    b = new Worker('BlackTimer.js');
    b.addEventListener('message', function(event) {
      document.getElementById('BlackTimer').innerHTML = event.data;
        btime = event.data

    }
    );
    if(document.getElementById('BlackTimer').innerHTML == '10:00'){
        b.postMessage('10:00')
    }
    else{
        b.postMessage(btime)
    }
}

function stopBlackTimer(){
    if(b!= undefined){
        b.terminate();
        b = undefined;
    }
}
//flipTable();
var flip = document.getElementById('flip');
document.getElementById('Board').style.flexDirection = 'column'
flip.setAttribute('type','Button');
flip.onclick = function(){
    flipTable();
    if(document.getElementById('Board').style.flexDirection == 'column'){
        document.getElementById('Board').style.flexDirection = 'column-reverse'
    }
    else{
        document.getElementById('Board').style.flexDirection = 'column'
    }
};

Game();
UpdateDisplayBoard();