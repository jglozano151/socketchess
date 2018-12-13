import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {getLegalMoves} from './getmoves';
import whitePawn from './pieces/whitePawn.png';
import whiteKnight from './pieces/whiteKnight.png';
import whiteRook from './pieces/whiteRook.png';
import whiteQueen from './pieces/whiteQueen.png';
import whiteBishop from './pieces/whiteBishop.png';
import whiteKing from './pieces/whiteKing.png';
import blackPawn from './pieces/blackPawn.png';
import blackRook from './pieces/blackRook.png';
import blackKnight from './pieces/blackKnight.png';
import blackBishop from './pieces/blackBishop.png';
import blackQueen from './pieces/blackQueen.png';
import blackKing from './pieces/blackKing.png';
import Avatar from '@material-ui/core/Avatar';
import {checkKingStatus} from './checkKingStatus'; 
import Snackbar from '@material-ui/core/Snackbar'; 
import Button from '@material-ui/core/Button'; 
import Paper from '@material-ui/core/Paper'; 
const io = require('socket.io-client')

export default class Board extends Component {
  state = {
    id: null, 
    turn: 'White',
    board: [
      ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
      ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
      ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
    ],
    takenPieces: {
      white: [],
      black: [],
    },
    winner: null,
    players: [],
    createdAt: null,
    socket: io.connect('/'),
    selection: [null, null],
    legalMoves: [],
    inCheck: null, 
    ownCheckSnack: false, 
  }
  componentWillMount() {
    if (this.props.game != null) {
      let {winner, turn, board, takenPieces, players, createdAt, id, inCheck} = this.props.game;
      this.setState({winner, turn, board, takenPieces, players, createdAt, inCheck, id})
    }
  }
  componentDidMount() {
    this.state.socket.on('connect', () => {
      console.log('connected'); 
      this.state.socket.on('updateBoard', (data) => {
        console.log('here');
        this.setState({
          winner: data.game.winner,
          turn: data.game.turn,
          board: data.game.board,
          takenPieces: data.game.takenPieces,
          inCheck: data.game.inCheck,
        })
      })
    })
  }
  showCheckWarning = () => { 
    console.log('Showing snack!')
    this.setState({ownCheckSnack: true});
  }
  hideCheckWarning = () => { 
    this.setState({ownCheckSnack: false});
  }
  /*----------------------------------------------------------------------------------------------------
    This function runs when a player clicks a square on the board. It has four different cases based on 
    where in the current turn the player is, and if the move is legal or not
    --------------------------------------------------------------------------------------------------*/
  checkMoves = (row, col, piece) => {
    // First, see if the game is over 
    if (this.state.winner) return; 
    // Case 1: No selection has been made yet
    if (this.state.selection[0] == null) {
      if (piece == null) return // Do nothing for an empty square
      if (this.state.turn === 'White' ?
        this.state.players[0] != this.props.username :
        this.state.players[1] != this.props.username) return // Do nothing if it is not the player's turn
      // Make it so you can only select your own pieces
      if (this.state.players[0] === this.props.username && piece[0] === 'b') return;
      if (this.state.players[1] === this.props.username && piece[0] === 'w') return;
      this.setState({
        selection: [row, col],
        legalMoves: getLegalMoves(row, col, piece, this.state.board)
      });
      return
    }
    // Case 2: Player has selected a piece, and clicks on an empty space
    if (piece == null) {
      let {legalMoves, selection} = this.state;
      let board = JSON.parse(JSON.stringify(this.state.board));
      let selectedPiece = this.state.board[selection[0]][selection[1]];
      for (let i = 0; i < legalMoves.length; i++) {
        if (row === legalMoves[i][0] && col === legalMoves[i][1]) {
          let movePiece = board[selection[0]][selection[1]];
          board[selection[0]][selection[1]] = null;
          board[row][col] = movePiece;
          {/* First, we see if the move would put the player's own king in check, or does 
          not get him out of check. Then we see if the move puts the opponent in check */} 
          if (checkKingStatus(this.state.turn, board)) {
            this.showCheckWarning() 
          }
          else {
            // See if the move puts the opposing king in check; 
            let checkOpponent = checkKingStatus(this.state.turn === 'White' ? 'Black' : 'White', board); 
            let inCheck = null; 
            if (checkOpponent) this.state.turn === 'White' ? inCheck = 'Black' : inCheck = 'White'; 
            this.state.socket.emit('makeMove', {
              board: board,
              takenPieces: this.state.takenPieces,
              winner: this.state.winner,
              turn: this.state.turn === 'White' ? 'Black' : 'White',
              inCheck,
              id: this.state.id
            })
          }
        }
      }
      // Take out board once the socket receive works
      this.setState({selection: [null, null], legalMoves: []})
      return;
    }
    // Case 3: Player has already selected a piece, then clicks another one of their own pieces
    if ((this.state.players[0] === this.props.username && piece[0] === 'w') ||
        (this.state.players[1] === this.props.username && piece[0] === 'b')) {
      this.setState({
        selection: [row, col],
        legalMoves: getLegalMoves(row, col, piece, this.state.board)
      });
      return
    }
    // Case 4: Player has selected a piece, and clicks on an opposing piece
    let {legalMoves, selection} = this.state;
    let board = JSON.parse(JSON.stringify(this.state.board));
    let takenPieces = JSON.parse(JSON.stringify(this.state.takenPieces));
    let selectedPiece = this.state.board[selection[0]][selection[1]];
    for (let i = 0; i < legalMoves.length; i++) {
      if (row === legalMoves[i][0] && col === legalMoves[i][1]) {
        let movePiece = board[selection[0]][selection[1]];
        board[selection[0]][selection[1]] = null;
        board[row][col] = movePiece;
        // Do the check logic before setting state here 
        if (checkKingStatus(this.state.turn, board)) {
          this.showCheckWarning() 
        }
        else {
          this.state.turn === 'White' ?
            takenPieces.white.push(board[row][col]) :
            takenPieces.black.push(board[row][col]);
          let checkOpponent = checkKingStatus(this.state.turn === 'White' ? 'Black' : 'White', board); 
          let inCheck = null; 
          if (checkOpponent) this.state.turn === 'White' ? inCheck = 'Black' : inCheck = 'White'; 
          this.state.socket.emit('makeMove', {
            board: board,
            takenPieces: takenPieces,
            winner: this.state.winner,
            turn: this.state.turn === 'White' ? 'Black' : 'White',
            inCheck, 
            id: this.state.id
          })
        }
      }
    }
    // Take out board and takenPieces once the socket.emit works
    this.setState({
      selection: [null, null], legalMoves: []})
    return;
  }
  // Highlight the square that a player clicks on, if it is their own piece and it's currently their turn
  setStyle = (row, col) => {
    if (this.state.selection[0] === row && this.state.selection[1] === col) return true
    for (let i = 0; i < this.state.legalMoves.length; i ++) { 
      if (this.state.legalMoves[i][0] === row && this.state.legalMoves[i][1] === col) return true 
    }
    return false
  }
  concedeGame = () => { 
    let winner = null; 
    console.log(this.state.turn); 
    this.state.turn === 'White' ? winner = 'Black' : winner = 'White'; 
    this.setState({winner}); 
  }
  render() {
    return (
      <div style = {{display: 'flex'}}>
        {/* Snackbar messages */}
        <Snackbar anchorOrigin = {{vertical: 'bottom', horizontal: 'left'}} open = {this.state.ownCheckSnack}
          autoHideDuration = {6000} onClose = {this.hideCheckWarning} message = {
          this.state.inCheck ? <span> Your King is in Check! </span> : <span> This move would put your king in check! </span> }/> 
        <div style = {{display: 'flex', flexDirection: 'column'}}>
          <Typography variant = "h3"> {this.state.inCheck ? 'CHECK': ''} </Typography>  
          {this.state.board.map((row, index) => (
            <div style = {{display: 'flex', flexDirection: 'row'}}>
              {row.map((square, index2) => (
                <div onClick = {() => this.checkMoves(index, index2, square)}>
                  <Square index = {index} index2 = {index2} square = {square}
                    setStyle = {this.setStyle}/>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style = {{padding: 25}}>
          <Paper style = {{padding: 10, marginBottom: 25}}> 
            {this.state.winner ? <Typography variant = "title"> Winner: {this.state.winner} </Typography> :
              <Typography variant = "subheading"> Turn: {this.state.turn} </Typography>
            }
          </Paper> 
          <div style = {{maxWidth: 125,
            minHeight: 100, backgroundColor: '#ededed', display: 'flex',
            borderRadius: 5, marginBottom: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
            {this.state.takenPieces.white.map((piece) => (
              <Avatar src = {pieceMap[piece]}/>
            ))}
          </div>
          <div style = {{maxWidth: 125,
            minHeight: 100, backgroundColor: '#232323', display: 'flex',
            borderRadius: 5, marginBottom: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
            {this.state.takenPieces.black.map((piece) => (
              <Avatar src = {pieceMap[piece]}/>
            ))}
          </div>
          <Button style = {{backgroundColor: '#232323', color: '#ededed', marginTop: 25}} onClick = {() => this.concedeGame()}> Concede Game </Button>  
        </div>
      </div>
    )
  }
}

class Square extends Component {
  render() {
    const color = (this.props.index % 2 === 0) ? ((this.props.index2 % 2) === 0 ? '#ededed' : '#284168') :
      ((this.props.index2 % 2) === 0 ? '#284168' : '#ededed')
    const text = color === '#ededed' ? '#284168' : '#ededed'
    const style = {
      height: '10vh',
      width: '10vh',
      backgroundColor: this.props.setStyle(this.props.index, this.props.index2) ? "#799301" : color,
      color: text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5
    }
    return (
      <div style = {style}>
        {this.props.square == null ?
          null :
          <Avatar src = {pieceMap[this.props.square]}/>
        }
      </div>
    )
  }
}

const pieceMap = {
  'wP': whitePawn,
  'wR': whiteRook,
  'wN': whiteKnight,
  'wB': whiteBishop,
  'wQ': whiteQueen,
  'wK': whiteKing,
  'bP': blackPawn,
  'bR': blackRook,
  'bN': blackKnight,
  'bB': blackBishop,
  'bQ': blackQueen,
  'bK': blackKing
}
