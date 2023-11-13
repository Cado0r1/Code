import { StyleSheet, Text, View } from 'react-native';
import '../static/menu.css'
import React, { useEffect, useState } from "react"

var Board = 'rbnqknbr,pppppppp,8,8,8,8,PPPPPPPP,RBNQKNBR'
function SetUpGame(){
  var Board = 'rbnqknbr,pppppppp,8,8,8,8,PPPPPPPP,RBNQKNBR'
  var moves = 1
  var score = null
  GenerateBoard()
}

function GenerateBoard(){
  let ids = []
  for (let i = 0; i < 64; i++) {
    ids.push(i)
  } 
  return (
      <div id='ChessBoard'>
        {ids.map((ids)=>(
          <div id={ids+1} class='tile'></div>
        ))}
      </div>
  );
}

function SetPieces(){
  for (let i = 1; i < 8; i++) {
    Board = Board.replace(',','')
  }
  for (let i = 1; i < 65; i++) {
    document.getElementById(i.toString()).innerHTML = Board[i-1]
    if(Board[i] === '8'){
      for (let j = 1; j < parseInt(Board[i]); j++) {
        i=i+parseInt(Board[i])
      }
    }
  }
} 



export default function app(){
  return(
    <GenerateBoard></GenerateBoard>
  )
}
setTimeout(() => {
  SetPieces();
}, "1000");


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
