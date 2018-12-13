export const checkKingStatus = (color, board) => { 
    let self = color === 'White' ? 'w' : 'b'; 
    let opponent = color === 'White' ? 'b' : 'w'; 
    let king = null; 
    // Find the position of the player's king 
    for (let row = 0; row < 8; row ++) { 
        for (let col = 0; col < 8; col ++) { 
            if (board[row][col] === self + 'K') {
                king = [row, col];  
            }
        }
    }
    // Check if there is a threat in each direction, returning true if there is 
    let directions = [
        checkUp(self, opponent, board, king),
        checkUpRight(self, opponent, board, king), 
        checkRight(self, opponent, board, king), 
        checkDownRight(self, opponent, board, king), 
        checkDown(self, opponent, board, king), 
        checkDownLeft(self, opponent, board, king), 
        checkLeft(self, opponent, board, king), 
        checkUpLeft(self, opponent, board, king)
    ]
    for (let i = 0; i < directions.length; i ++) { 
        if (directions[i]) return true;
    }
    return false; 
}

//------------------------------------------------------------------------------
// Directional checks to see if the king is threatened by the move 
//------------------------------------------------------------------------------
const checkDown = (self, opponent, board, king) => { 
    let row = king[0] + 1; 
    let col = king[1]; 
    if (row === 8) return false; 
    if (board[row][col] && board[row][col][0] === opponent && board[row][col][1] === 'K') return true; 
    while (row < 8) { 
        if (board[row][col] == null) {
            row ++; 
        }
        else if (board[row][col][0] === self) {
            return false; 
        }
        else if (board[row][col][0] === opponent) { 
            if (board[row][col][1] === 'Q' || board[row][col][1] === 'R') return true;
            return false; 
        }
    }
    return false; 
}

const checkUp = (self, opponent, board, king) => { 
    console.log(self, king);
    let row = king[0] - 1; 
    let col = king[1]; 
    if (row === -1) return false; 
    if (board[row][col] && board[row][col][0] === opponent && board[row][col][1] === 'K') return true;
    while (row > -1) { 
        if (board[row][col] == null) { 
            row --; 
        }
        else if (board[row][col][0] === self) { 
            return false; 
        }
        else if (board[row][col][0] === opponent) { 
            if (board[row][col][1] === 'Q' || board[row][col][1] === 'R') return true;
            return false; 
        }
    } 
    return false; 
}

const checkLeft = (self, opponent, board, king) => {
    let row = king[0]; 
    let col = king[1] - 1; 
    if (col === -1) return false; 
    if (board[row][col] && board[row][col][0] === opponent && board[row][col][1] === 'K') return true; 
    while (col > -1) { 
        if (board[row][col] == null) { 
            col --; 
        }
        else if (board[row][col][0] === self) return false; 
        else if (board[row][col][0] === opponent) {
            if (board[row][col][1] === 'Q' || board[row][col][1] === 'R') return true 
            return false; 
        }
    }
    return false; 
}

const checkRight = (self, opponent, board, king) => {
    let row = king[0]; 
    let col = king[1] + 1; 
    if (col === 8) return false; 
    if (board[row][col] && board[row][col][0] === opponent && board[row][col][1] === 'K') return true; 
    while (col < 8) { 
        if (board[row][col] == null) { 
            col ++; 
        }
        else if (board[row][col][0] === self) return false;
        else if (board[row][col][0] === opponent) {
            if (board[row][col][1] === 'Q' || board[row][col][1] === 'R') return true;
            return false;  
        }
    }
    return false; 
}

// Fix the logic for the first four functions! 

const checkUpLeft = (self, opponent, board, king) => { 
    let row = king[0] - 1; 
    let col = king[1] - 1; 
    // King is either at top of board, or left of board (or top left corner)
    if (row === -1 || col === -1) return false; 
    // Check to see if the player is trying to move next to the opposing king 
    if (board[row][col] && board[row][col][0] === opponent && board[row][col][1] === 'K') return true; 
    while (row > -1 && col > -1) { 
        // Next space in direction is empty, move to next space 
        if (board[row][col] == null) { 
            col --; 
            row --;
        }
        // Next space in direction is player's own piece 
        else if (board[row][col][0] === self) return false; 
        // Next space in direction is occupied by opposing player's piece 
        else if (board[row][col][0] === opponent) { 
            if (board[row][col][1] === 'B' || board[row][col][1] === 'Q') return true;
            return false;  
        }
    }
    // If all spaces in the direction are clear
    return false; 
}

const checkUpRight = (self, opponent, board, king) => {
    let row = king[0] - 1; 
    let col = king[1] + 1; 
    if (row === -1 || col === 8) return false; 
    if (board[row][col] && board[row][col][0] === opponent && board[row][col][1] === 'K') return true; 
    while (row > -1 && col < 8) {
        if (board[row][col] == null) {
            row --; 
            col ++; 
        }
        else if (board[row][col][0] === self) return false; 
        else if (board[row][col][0] === opponent) { 
            if (board[row][col][1] === 'B' || board[row][col][1] === 'Q') return true; 
            return false; 
        }
    }
    return false; 
}

const checkDownLeft = (self, opponent, board, king) => { 
    let row = king[0] + 1; 
    let col = king[1] - 1; 
    if (row === 8 || col === -1) return false; 
    if (board[row][col] && board[row][col][0] === opponent && board[row][col][1] === 'K') return true; 
    while (row < 8 && col > -1) {
        if (board[row][col] == null) { 
            row ++; 
            col --; 
        }
        else if (board[row][col][0] === self) return false; 
        else if (board[row][col][0] === opponent) {
            if (board[row][col][1] === 'B' || board[row][col][1] === 'Q') return true;
            return false; 
        }
    }
    return false;
}

const checkDownRight = (self, opponent, board, king) => { 
    let row = king[0] + 1; 
    let col = king[1] + 1; 
    if (row === 8 || col === 8) return false; 
    if (board[row][col] && board[row][col][0] === opponent && board[row][col][1] === 'K') return true; 
    while (row < 8 && col < 8) { 
        if (board[row][col] == null) { 
            row ++; 
            col ++; 
        }
        else if (board[row][col][0] === self) return false; 
        else if (board[row][col][0] === opponent) {
            if (board[row][col][1] === 'B' || board[row][col][1] === 'Q') return true; 
            return false; 
        }
    }
    return false; 
}