'use server';

import Image from "next/image";
import { getGameState, updateGameState } from "../../actions";
import { GameState } from "@/lib/connnect4";
import { Board } from "../../ui/board";
import React from "react";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const gameState = await getGameState(id);


    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Board initialGameState={gameState}  />
                </div>
            </main>
        </div>
    );
}