'use client';

import { GameState, makeMove, validateMove } from "@/lib/connnect4";
import React from "react";
import { updateGameState, getGameState } from "../actions";

export function Board({ initialGameState }: {
    initialGameState: GameState
}) {
    const [gameState, setGameState] = React.useState<GameState>(initialGameState);
    const [invalidMove, setInvalidMove] = React.useState<{ row: number, col: number } | null>(null);

    // Poll for game state updates
    /*React.useEffect(() => {
        const pollGameState = async () => {
            const newState = await getGameState(initialGameState.id);
            setGameState(newState);
        };

        const interval = setInterval(pollGameState, 500);
        return () => clearInterval(interval);
    }, [initialGameState.id]);*/

    async function handleClick(gameState: GameState, row: number, col: number) {
        if (!validateMove(gameState, gameState.currentPlayer, row, col)) {
            setInvalidMove({ row, col });
            setTimeout(() => setInvalidMove(null), 250);
            return;
        }

        const newGameState = await updateGameState(gameState.id, gameState.version, row, col);
        setGameState(newGameState);
    }

    let stateDiv = (<div><h1>Now playing: {getPlayerName(gameState, gameState.currentPlayer)}</h1></div>);
    if (gameState.winner) {
        stateDiv = (
            <div>
                <h1>Game Over</h1>
                <p>{getPlayerName(gameState, gameState.winner)} wins!</p>
            </div>
        )
    }
    return (
        <div className="flex flex-col items-center justify-center" style={{ 'flexDirection': 'column-reverse' }}>
            {gameState.board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} className="w-10 h-10 bg-white border border-gray-300 rounded-md">
                            <div
                                className={`
                                    w-full 
                                    h-full 
                                    flex items-center justify-center transition-colors duration-250
                                    ${invalidMove?.row === rowIndex && invalidMove?.col === colIndex ? 'bg-red-200' : 'bg-white'}`}
                                onClick={() => handleClick(gameState, rowIndex, colIndex)}>
                                <div
                                    className={`${getCellColor(gameState, cell)} transition-colors duration-250 ${cell == 0 ? 'opacity-0' : 'opacity-100'}`}
                                    style={{
                                        borderRadius: '50%',
                                        width: '80%',
                                        height: '80%',
                                    }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            {stateDiv}
        </div>
    );
}

function getCellColor(gameState: GameState, cell: number) {
    if (cell === 0) {
        return 'bg-white';
    }
    return cell === gameState.players[0] ? 'bg-blue-500' : 'bg-red-500';
}

function getPlayerName(gameState: GameState, player: number) {
    return player == gameState.players[0] ? 'Blue' : 'Red'
}
