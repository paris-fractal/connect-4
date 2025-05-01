'use server';

import { GameState, validateMove, makeMove } from "@/lib/connnect4";
import { getGameState as getGameStateFromDb, updateGameState as updateGameStateInDb, crateGameState } from "./db";
import { v4 as uuidv4 } from 'uuid';

function createInitialGameState(): GameState {
    return {
        id: uuidv4(),
        board: [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
        currentPlayer: 1,
        players: [1, 2],
        winner: null,
        version: 0,
    };
}

export async function updateGameState(id: string, version: number, row: number, col: number) {
    const gameState = await getGameStateFromDb(id);
    if (!validateMove(gameState, gameState.currentPlayer, row, col)) {
        throw new Error("Invalid move");
    }
    if (gameState.version !== version) {
        throw new Error("Game state has been updated since last move");
    }

    const newGameState = makeMove(gameState, gameState.currentPlayer, row, col);
    return await updateGameStateInDb(newGameState);
}

export async function createGame() {
    const gameState = await crateGameState(createInitialGameState());
    return gameState;
}

export async function getGameState(id: string) {
    return await getGameStateFromDb(id);
}