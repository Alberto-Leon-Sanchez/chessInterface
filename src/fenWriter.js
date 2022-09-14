import {defaultPieces} from './pieces.js';
import {readFen} from './fenReader.js';

export function writeFen(game,board){
    game = readFen(game)
    let fen = "";
    for(let i=7; i>=0; i--){
        let empty = 0;
        for(let j=0; j<8; j++){
            if(board[i][j] === null){
                empty++;
            }else{
                if(empty > 0){
                    fen += empty;
                    empty = 0;
                }
                fen += pieceToChar(board[i][j]);
            }
        }
        if(empty > 0){
            fen += empty;
        }
        if(i !== 0){
            fen += "/";
        }
    }
    
    fen += " ";
    fen += (game.turn=='w' ? "b":"w")
    fen += " ";
    
    let castling = "";
    if(game.castling[0])
        castling += "K";
    if(game.castling[1])
        castling += "Q";
    if(game.castling[2])
        castling += "k";
    if(game.castling[3])
        castling += "q";

    if(castling === "")
        castling = "-";

    fen += castling;
    fen += " ";
    fen += game.enPassant;
    fen += " ";
    fen += game.halfMove;
    fen += " ";
    fen += (game.fullMove + 1);
    return fen;
}

function pieceToChar(piece){
    if(piece === defaultPieces.bP)
        return 'p';
    else if(piece === defaultPieces.wP)
        return 'P';
    else if(piece === defaultPieces.bR)
        return 'r';
    else if(piece === defaultPieces.wR)
        return 'R';
    else if(piece === defaultPieces.bN)
        return 'n';
    else if(piece === defaultPieces.wN)
        return 'N';
    else if(piece === defaultPieces.bB)
        return 'b';
    else if(piece === defaultPieces.wB)
        return 'B';
    else if(piece === defaultPieces.bQ)
        return 'q';
    else if(piece === defaultPieces.wQ)
        return 'Q';
    else if(piece === defaultPieces.bK)
        return 'k';
    else if(piece === defaultPieces.wK)
        return 'K';
}