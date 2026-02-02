import React from "react";
import { Trophy, ArrowRight, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const GameOverModal = ({
  isOpen,
  successCount,
  errorCount,
  onRestart,
  onGoToFreeMode,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl flex items-center gap-2 text-yellow-500">
            <Trophy className="w-8 h-8" /> Campanha Concluída!
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4 text-sm text-neutral-500 dark:text-neutral-400">
              <p className="text-base text-neutral-600 dark:text-neutral-300">
                Parabéns! Você completou todos os desafios do algoritmo de
                Huffman.
              </p>

              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg flex justify-around">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {successCount}
                  </div>
                  <div className="text-xs uppercase font-bold text-neutral-500">
                    Acertos
                  </div>
                </div>
                <div className="h-12 w-px bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {errorCount}
                  </div>
                  <div className="text-xs uppercase font-bold text-neutral-500">
                    Erros
                  </div>
                </div>
              </div>

              <p className="text-sm">O que deseja fazer agora?</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col gap-2 sm:gap-0">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={onRestart} className="flex-1">
              <RefreshCcw className="w-4 h-4 mr-2" /> Reiniciar Campanha
            </Button>
            <Button
              onClick={onGoToFreeMode}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Ir para Modo Livre <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
