import { prettyFormat, render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {defaultPieces} from './pieces.js';
import {readFen} from './fenReader.js';
import {writeFen} from './fenWriter.js';

  function Square(props){
      return(
        <div className='square' key={props.key} style= {{backgroundColor: props.color}} onClick={props.onClick}>
            {props.value}
        </div>
      );
  }

  class Board extends React.Component {
    
    renderSquare(index,indexRow,square,color){
      const white = "#e0e4e4";
      const black = "#90a4ac";
      return(
        <Square key={index} value={square} onClick={() => this.props.onClick(index)} color={this.props.highlight[indexRow][index%8] || (color%2===0 ? white:black)}/>
      )
    }

    render(){
      
      let color = false;
      let indexRow = 8;
      return(
          <>
            {this.props.squares.slice().reverse().map( (row) => {
              color = !color;
              indexRow-=1;
              let index = -1;
              return(
              <div key = {indexRow} className='row'>
                {row.map( (square) => {index+=1; color = !color;  return this.renderSquare(index+indexRow*8,indexRow,square,color)})}
              </div>
              )
            })}
          </>
        )
    }

  }
  
  class Game extends React.Component {
    
    constructor(props){
      super(props);
      
      this.state = {
         board: Array.from(Array(8).fill(null),()=> Array(8).fill(null)),
         highlight: Array.from(Array(8).fill(null),()=> Array(8).fill(null)),
         fen: "",
         activeSquare: null
      }
    }

    async highlightMoves(pos){
     
      let highlight = Array.from(Array(8).fill(null),()=> Array(8).fill(null));

      if(!(this.state.activeSquare != null) ){
        fetch("http://127.0.0.1:8080/getMoves?fen="+this.state.fen,{"METHOD":"GET"})
          .then((response) => response.json())
            .then((moves) => {
              for(let i = 0; i<moves.length;i++){
                if(moves[i].origin == pos){
                  highlight[Math.floor(moves[i].destiny/8)][moves[i].destiny%8] = "#c8d484"
                }
              }
            }).then(() => {
              this.setState({
                highlight: highlight,
                activeSquare:pos
              })
            })
      }else{
        let board = this.state.board.slice();
        let fen = this.state.fen;
        let promotion = "";

        fetch("http://127.0.0.1:8080/getMoves?fen="+this.state.fen,{"METHOD":"GET"})
        .then((response) => response.json())
          .then((moves) => {
            for(let i = 0; i<moves.length;i++){
              if(moves[i].origin == this.state.activeSquare && moves[i].destiny == pos){
                
                if((board[Math.floor(moves[i].origin/8)][moves[i].origin%8] == defaultPieces.wP && moves[i].destiny > 55) || (board[Math.floor(moves[i].origin/8)][moves[i].origin%8] == defaultPieces.bP && moves[i].destiny < 8)){
                  promotion = "Q";
                }

                fetch("http://127.0.0.1:8080/makeMove?fen="+this.state.fen+"&origin="+moves[i].origin
                  +"&destiny="+moves[i].destiny+"&promotion="+promotion, {"METHOD":"GET"})
                    .then(response => response.json())
                      .then(fenResponse => {
                        fen = fenResponse.fen
                        document.getElementById("fen").value = fen
                        this.loadFen("")
                      });
                
              }
            }
          }).then(() => {
            this.setState({
              highlight: Array.from(Array(8).fill(null),()=> Array(8).fill(null)),
              activeSquare:null,
            })
          })
      }
    }

    
    loadFen(fen){
      let inputFen = "";
      if(fen ==""){
        inputFen = document.getElementById("fen").value;
      }else{
      }
      if(inputFen === ""){
        this.setState({
          board: Array.from(Array(8).fill(null),()=> Array(8).fill(null))
        })
        return;
      }
      console.log(document.getElementById("fen").value)
      const game = readFen(document.getElementById("fen").value );
      
      this.setState({
        board: game.board,
        fen:inputFen,
      })
      
    }

    render(){
        
        return( 
          <div>
            <div className='board'>
              <Board squares = {this.state.board} highlight={this.state.highlight} onClick={pos => this.highlightMoves(pos)}/>
            </div>
            <div className='fenReader'>
                <input id="fen" type="text" defaultValue="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"/>
                <button id="fenButton" type="button" value="Load Fen" onClick={() => this.loadFen("")}/>  
            </div>
          </div>
        );
        
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  