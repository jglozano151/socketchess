export const getLegalMoves = (row, col, piece, board) => {
  // Sort into pieces
  switch(piece[1]) {
    case "P":
      return getPawnMoves(row, col, piece, board)
      break;
    case "R":
      return getRookMoves(row, col, piece, board)
      break;
    case "N":
      return getKnightMoves(row, col, piece, board)
      break;
    case "B":
      return getBishopMoves(row, col, piece, board)
      break;
    case "Q":
      return getQueenMoves(row, col, piece, board)
      break;
    case "K":
      return getKingMoves(row, col, piece, board)
      break;
  }
}

// Returns an array of possible moves for the selected piece
const getPawnMoves = (row, col, piece, board) => {
  let moves = [];
  if (piece[0] === 'w') {
    if (row === 0) return moves; // Pawn is at end of board
    if (board[row - 1][col] == null) moves.push([row - 1, col])
    if (row === 6 && board[4][col] == null) moves.push([4, col])
    if (col !== 0 && board[row - 1][col - 1] != null && board[row - 1][col - 1][0] === 'b') moves.push([row - 1, col - 1])
    if (col !== 7 && board[row - 1][col + 1] != null && board[row - 1][col + 1][0] === 'b') moves.push([row - 1, col + 1])
    return moves;
  }
  if (piece[0] === 'b') {
    if (row === 7) return moves;
    if (board[row + 1][col] == null) moves.push([row + 1, col])
    if (row === 1 && board[3][col] == null) moves.push([3, col])
    if (col !== 7 && board[row + 1][col - 1] != null && board[row + 1][col - 1][0] === 'w') moves.push([row + 1, col - 1])
    if (col !== 7 && board[row + 1][col + 1] != null && board[row + 1][col + 1][0] === 'w') moves.push([row + 1, col + 1])
    return moves; 
  }
}
const getRookMoves = (row, col, piece, board) => {
  let opposite = piece[0] === 'w' ? 'b' : 'w';
  let moves = [];
  if (row !== 7) {
    for (let i = row + 1; i < 8; i ++) {
      if (board[i][col] == null) moves.push([i, col]);
      else if (board[i][col][0] === opposite) {
        moves.push([i, col]);
        i = 8;
      }
      else i = 8;
    }
  }
  if (row !== 0) {
    for (let i = row - 1; i > -1; i --) {
      if (board[i][col] == null) moves.push([i, col]);
      else if (board[i][col][0] === opposite) {
        moves.push([i, col]);
        i = -1;
      }
      else i = -1;
    }
  }
  if (col !== 7) {
    for (let i = col + 1; i < 8; i ++) {
      if (board[row][i] == null) moves.push([row, i]);
      else if (board[row][i][0] === opposite) {
        moves.push([row, i]);
        i = 8;
      }
      else i = 8;
    }
  }
  if (col !== 0) {
    for (let i = col - 1; i > -1; i--) {
      if (board[row][i] == null) moves.push([row, i]);
      else if (board[row][i][0] === opposite) {
        moves.push([row, i]);
        i = -1;
      }
      else i = -1
    }
  }
  return moves
}
const getKnightMoves = (row, col, piece, board) => {
  let opposite = piece[0] === 'w' ? 'b' : 'w';
  let potential = [
    [row + 2, col + 1], [row + 2, col - 1], [row - 2, col + 1], [row - 2, col - 1],
    [row + 1, col + 2], [row + 1, col - 2], [row - 1, col + 2], [row - 1, col - 2]
  ];
  return checkPotential(potential, opposite, board);
}
const getBishopMoves = (row, col, piece, board) => {
  let opposite = piece[0] === 'w' ? 'b' : 'w';
  let moves = [];
  // Check the up-left diagonal
  if (row !== 0 && col !== 0) {
    let x = row;
    let y = col;
    while (x !== 0 && y !== 0) {
      if (board[x - 1][y - 1] == null) {
        moves.push([x - 1, y - 1]);
        x --;
        y --;
      }
      else if (board[x - 1][y - 1][0] === opposite) {
        moves.push([x - 1, y - 1])
        x = 0;
      }
      else x = 0;
    }
  }
  // Check the down-left diagonal
  if (row !== 7 && col !== 0) {
    let x = row;
    let y = col;
    while (x !== 7 && y !== 0) {
      if (board[x + 1][y - 1] == null) {
        moves.push([x + 1, y - 1]);
        x ++;
        y --;
      }
      else if (board[x + 1][y - 1][0] === opposite) {
        moves.push([x + 1, y - 1])
        x = 7;
      }
      else x = 7;
    }
  }
  // Check the up-right diagonal
  if (row !== 0 && col !== 7) {
    let x = row;
    let y = col;
    while (x !== 0 && y !== 7) {
      if (board[x - 1][y + 1] == null) {
        moves.push([x - 1, y + 1]);
        x --;
        y ++;
      }
      else if (board[x - 1][y + 1][0] === opposite) {
        moves.push([x - 1, y + 1]);
        x = 0;
      }
      else x = 0;
    }
  }
  // Check the down-right diagonal
  if (row !== 7 && col !== 7) {
    let x = row;
    let y = col;
    while (x !== 7 && col !== 7) {
      if (board[x + 1][y + 1] == null) {
        moves.push([x + 1, y + 1]);
        x ++;
        y ++;
      }
      else if (board[x + 1][y + 1][0] === opposite) {
        moves.push([x + 1, y + 1]);
        x = 7;
      }
      else x = 7;
    }
  }
  return moves
}
const getQueenMoves = (row, col, piece, board) => {
  let rookMoves = getRookMoves(row, col, piece, board);
  let bishopMoves = getBishopMoves(row, col, piece, board);
  for (let i = 0; i < rookMoves.length; i ++) {
    bishopMoves.push(rookMoves[i]);
  }
  return bishopMoves;
}
const getKingMoves = (row, col, piece, board) => {
  let opposite = piece[0] === 'w' ? 'b' : 'w';
  let potential = [
    [row + 1, col], [row + 1, col + 1], [row, col + 1], [row - 1, col + 1],
    [row - 1, col], [row - 1, col - 1], [row, col - 1], [row + 1, col - 1]
  ];
  return checkPotential(potential, opposite, board);
}
// Use this for calculating king/knight moves
const checkPotential = (potential, opposite, board) => {
  let moves = [];
  for (let i = 0; i < potential.length; i ++) {
    if (potential[i][0] <= 7 && potential[i][0] >= 0 && potential[i][1] <= 7 && potential[i][1] >= 0) {
      if (board[potential[i][0]][potential[i][1]] == null ||
        board[potential[i][0]][potential[i][1]][0] == opposite) {
        moves.push(potential[i]);
      }
    }
  }
  return moves;
}
