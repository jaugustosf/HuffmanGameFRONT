import React from "react";
import { Info, CheckCircle2, XCircle, Trophy, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const GameInfo = ({ gameMode, successCount, errorCount }) => {
  return (
    <div className="absolute top-4 right-4 z-10 max-w-xs flex flex-col gap-3">
      <Card className="shadow-md bg-white/90 backdrop-blur dark:bg-neutral-800/90 dark:border-neutral-700">
        <CardContent className="px-4 text-sm text-neutral-600 dark:text-neutral-300 space-y-2">
          <p className="font-semibold flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
            <Info className="w-4 h-4" /> Regras:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Conecte os 2 menores valores.</li>
            <li>
              O <strong>Modo Livre</strong> desbloqueia no final.
            </li>
          </ul>
          {gameMode === "free" && (
            <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700 text-xs text-purple-500 font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Modo Mestre Ativo
            </div>
          )}
          {gameMode === "campaign" && (
            <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Input Bloqueado
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2 w-full">
        <div className="flex-1 bg-white/90 dark:bg-neutral-800/90 backdrop-blur border-l-4 border-green-500 rounded-r-md shadow-sm p-2 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
            Acertos
          </span>
          <div className="flex items-center text-green-600 dark:text-green-400 font-bold text-lg">
            <CheckCircle2 className="w-4 h-4 mr-1" /> {successCount}
          </div>
        </div>
        <div className="flex-1 bg-white/90 dark:bg-neutral-800/90 backdrop-blur border-l-4 border-red-500 rounded-r-md shadow-sm p-2 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
            Erros
          </span>
          <div className="flex items-center text-red-600 dark:text-red-400 font-bold text-lg">
            <XCircle className="w-4 h-4 mr-1" /> {errorCount}
          </div>
        </div>
      </div>
    </div>
  );
};
