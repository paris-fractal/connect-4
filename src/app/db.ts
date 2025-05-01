'use server';

import postgres, { RowList, Row } from 'postgres';
import { GameState } from '@/lib/connnect4';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getGameState(gameId: string) {
    const result = await sql`SELECT * FROM game_state WHERE id = ${gameId}`;
    return toGameState(result);
}

export async function crateGameState(gameState: GameState) {
    const result = await sql`
    INSERT INTO game_state
    (id, board, current_player, players, winner, version)
    VALUES
    (${gameState.id}, ${JSON.stringify(gameState.board)}, ${gameState.currentPlayer}, ${JSON.stringify(gameState.players)}, ${gameState.winner}, ${gameState.version})
    RETURNING *;`;
    return toGameState(result);
}

function toGameState(rowResult: RowList<Row[]>) {

    const game = rowResult[0];
    return {
        id: game.id,
        board: JSON.parse(game.board),
        currentPlayer: game.current_player,
        players: JSON.parse(game.players),
        winner: game.winner,
        version: game.version,
    };
}

export async function updateGameState(gameState: GameState) {
    const currentTime = new Date();
    const result = await sql`
    UPDATE game_state
SET 
    board = ${JSON.stringify(gameState.board)},
    current_player = ${gameState.currentPlayer},
    players = ${JSON.stringify(gameState.players)},
    winner = ${gameState.winner},
    version = ${gameState.version}
WHERE 
    id = ${gameState.id}
    AND version = ${gameState.version} - 1
    RETURNING *;`;

    if (result.count === 0) {
        throw new Error('Game state was not updated');
    }
    console.log("Updated game state in", new Date().getTime() - currentTime.getTime(), "ms");
    return toGameState(result);
}

export async function setupGameState() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE game_state (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          board TEXT NOT NULL,
          current_player INT NOT NULL,
          players TEXT NOT NULL,
          winner INT,
          version INT NOT NULL
      );
    `;
}
