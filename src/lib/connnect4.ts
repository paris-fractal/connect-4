export type GameState = {
    id: string;
    board: number[][];
    currentPlayer: number;
    players: number[];
    winner: number | null;
    version: number;
};

export function makeMove(gameState: GameState, mover: number, row: number, col: number) {
    if (!validateMove(gameState, mover, row, col)) {
        throw new Error('Invalid move');
    }

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = gameState.currentPlayer;
    return {
        ...gameState,
        board: newBoard,
        winner: computeWinner(newBoard),
        currentPlayer: gameState.currentPlayer === gameState.players[0] ?
            gameState.players[1] : gameState.players[0],
        version: gameState.version + 1,
    };
}

function computeWinner(board: number[][]) {
    const rows = board.length;
    const cols = board[0].length;
    const consecutiveH = new Array(rows).fill(0).map(() => new Array(cols).fill(1));
    const consecutiveV = new Array(rows).fill(0).map(() => new Array(cols).fill(1));
    const consecutiveD1 = new Array(rows).fill(0).map(() => new Array(cols).fill(1));
    const consecutiveD2 = new Array(rows).fill(0).map(() => new Array(cols).fill(1));

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const player = board[row][col];
            if (player === 0) {
                continue;
            }
            if (row !== 0) {
                if (board[row - 1][col] === player) {
                    consecutiveV[row][col] = consecutiveV[row - 1][col] + 1;
                }
            }
            if (col !== 0) {
                if (board[row][col - 1] === player) {
                    consecutiveH[row][col] = consecutiveH[row][col - 1] + 1;
                }
            }
            if (row !== 0 && col !== 0) {
                if (board[row - 1][col - 1] === player) {
                    consecutiveD1[row][col] = consecutiveD1[row - 1][col - 1] + 1;
                }
            }
            if (row !== 0 && col !== cols - 1) {
                if (board[row - 1][col + 1] === player) {
                    consecutiveD2[row][col] = consecutiveD2[row - 1][col + 1] + 1;
                }
            }

            if (consecutiveH[row][col] >= 4 || consecutiveV[row][col] >= 4 || consecutiveD1[row][col] >= 4 || consecutiveD2[row][col] >= 4) {
                return player;
            }
        }
    }
    return null;
}

export function validateMove(gameState: GameState, mover: number, row: number, col: number) {
    if (gameState.winner) {
        return false;
    }

    if (row < 0 || row >= gameState.board.length || col < 0 || col >= gameState.board[0].length) {
        return false;
    }

    if (gameState.currentPlayer !== mover) {
        // not your turn
        return false;
    }

    if (gameState.board[row][col] !== 0) {
        // space already occupied
        return false;
    }

    if (row > 0 && gameState.board[row - 1][col] === 0) {
        // piece must be rest on the bottom of the board or on top of another piece
        return false;
    }

    return true;
}


