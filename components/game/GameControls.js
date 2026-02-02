import React from "react";
import {
  Play,
  RotateCcw,
  Moon,
  Sun,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

export const GameControls = ({
  gameMode,
  levelName,
  word,
  setWord,
  currentWordIndex,
  totalWordsInLevel,
  mounted,
  theme, // Recebe o resolvedTheme
  setTheme,
  nodesLength,
  historyLength,
  gameWon,
  levelCompleted,
  onStartGame,
  onUndo,
  onValidate,
  onNextLevel,
}) => {
  return (
    <div className="absolute z-10 top-4 left-4 w-96">
      <Card className="shadow-lg opacity-95 hover:opacity-100 transition-opacity bg-white dark:bg-neutral-800 dark:border-neutral-700">
        <CardHeader className="pb-3 pt-4">
          <div className="flex justify-between items-center mb-2">
            {/* --- DISPLAY DE NÍVEL --- */}
            {gameMode === "campaign" ? (
              <div className="flex flex-col items-start gap-1">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-neutral-400">
                  Nível:{" "}
                  <strong className="ml-1 uppercase text-blue-600 dark:text-blue-400">
                    {levelName}
                  </strong>
                </span>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  Palavra:{" "}
                  <span className="font-bold text-black dark:text-white">
                    "{word}"
                  </span>{" "}
                  ({currentWordIndex + 1}/{totalWordsInLevel})
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-purple-600 text-white hover:bg-purple-700">
                MODO LIVRE
              </span>
            )}

            {/* --- DARK MODE CORRIGIDO --- */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                // Se está 'dark', ao clicar vira 'light', e vice-versa
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                {/* Se o tema resolvido for dark, mostra o Sol para indicar que pode ir pro light */}
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid gap-3">
          {/* Input só aparece no MODO LIVRE */}
          {gameMode === "free" && (
            <div className="flex gap-2">
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onStartGame()}
                placeholder="Digite a palavra..."
                className="bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              />
              <Button onClick={() => onStartGame()} size="icon">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Botão de Jogar (Campanha) */}
          {gameMode === "campaign" && nodesLength === 0 && (
            <Button onClick={() => onStartGame()} className="w-full gap-2">
              <Play className="w-4 h-4" /> Começar Fase
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onUndo}
              disabled={historyLength === 0}
              className="flex-1 gap-2 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              <RotateCcw className="w-4 h-4" /> Desfazer
            </Button>
          </div>

          {/* BOTÃO VALIDAR */}
          {gameWon && !levelCompleted && (
            <Button
              onClick={onValidate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white animate-in fade-in zoom-in duration-300"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Validar Árvore
            </Button>
          )}

          {/* BOTÃO PRÓXIMO NÍVEL */}
          {levelCompleted && (
            <Button
              onClick={onNextLevel}
              className="w-full bg-green-600 hover:bg-green-700 text-white animate-in slide-in-from-bottom-2 duration-300 shadow-lg shadow-green-900/20"
            >
              Próximo Desafio <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
