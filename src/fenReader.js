import {defaultPieces} from './pieces.js';

export function readFen(fen){
    
    fen = fen.split(" ");

    return({
        board:getBoard(fen[0]),
        turn:getTurn(fen[1]),
        castling:getCastling(fen[2]),
        enPassant:getEnPassant(fen[3]),
        halfMove:getHalfMove(fen[4]),
        fullMove:getFullMove(fen[5])
    })
}

function getBoard(fen){
    
    let row = 7;
    let column = 0;
    let board = Array.from(Array(8).fill(null),()=> Array(8).fill(null));

    for(let i=0; i<fen.length;i++){
        
        if(fen[i] === '/'){
            row-=1
            column = 0
        }else if(!isNaN(fen[i])){
            column += parseInt(fen[i]);
        }else{
            board[row][column] = getPiece(fen[i]);
            column+=1;
        }
    }
    return board;
}

function getPiece(char){
    
    if(char === 'p')
        return defaultPieces.bP;
    else if(char === 'P')
        return defaultPieces.wP;
    else if(char === 'r')
        return defaultPieces.bR;
    else if(char === 'R')
        return defaultPieces.wR;
    else if(char === 'n')
        return defaultPieces.bN;
    else if(char === 'N')
        return defaultPieces.wN;
    else if(char === 'b')
        return defaultPieces.bB;
    else if(char === 'B')
        return defaultPieces.wB;
    else if(char === 'q')
        return defaultPieces.bQ;
    else if(char === 'Q')
        return defaultPieces.wQ;
    else if(char === 'k')
        return defaultPieces.bK;
    else if(char === 'K')
        return defaultPieces.wK;
    else
        return null
   
}

function getTurn(fen){
    return fen
}

function getCastling(fen){
    let castling = [false,false,false,false]

    if(fen.includes('K'))
        castling[0] = true
    if(fen.includes('Q'))
        castling[1] = true
    if(fen.includes('k'))
        castling[2] = true
    if(fen.includes('q'))
        castling[3] = true
    
    return castling
}

function getEnPassant(fen){
    return fen
}

function getHalfMove(fen){
    return parseInt(fen)
}

function getFullMove(fen){
    return parseInt(fen)
}
