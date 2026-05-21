import React from "react";
import {
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Trophy,
  Info,
} from "lucide-react";

export const GameInfo = ({ gameMode, successCount, errorCount, score = 0 }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* 1. REGRAS BÁSICAS */}
      <div className="bg-white dark:bg-[#1B1B1B] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-neutral-500" />
          <h3 className="font-bold text-neutral-800 dark:text-neutral-200">
            Regras:
          </h3>
        </div>
        <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 mb-4 list-disc pl-5">
          <li>Conecte os 2 menores valores.</li>
          <li>
            O{" "}
            <strong className="text-neutral-800 dark:text-neutral-200">
              Modo Livre
            </strong>{" "}
            desbloqueia no final.
          </li>
        </ul>

        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-xs text-neutral-500">
          {gameMode === "free" ? (
            <>
              <Unlock className="w-3.5 h-3.5" /> Input Liberado
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" /> Input Bloqueado
            </>
          )}
        </div>
      </div>

      {/* 2. NOVO: PLACAR DE PONTOS (SCORE) */}
      <div className="bg-green-600 rounded-xl p-4 shadow-md text-white flex items-center justify-between transform transition-all hover:scale-[1.02]">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-green-100" />
          <span className="font-black tracking-wider opacity-90">SCORE</span>
        </div>
        <span className="text-3xl font-black drop-shadow-md">{score}</span>
      </div>

      {/* 3. ACERTOS E ERROS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1B1B1B] border-l-4 border-l-green-500 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 flex items-center justify-between shadow-sm">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            ACERTOS
          </span>
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
            <CheckCircle2 className="w-4.5 h-4.5" />
            <span className="text-xl font-black">{successCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1B1B1B] border-l-4 border-l-red-500 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 flex items-center justify-between shadow-sm">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            ERROS
          </span>
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-500">
            <XCircle className="w-4.5 h-4.5" />
            <span className="text-xl font-black">{errorCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
