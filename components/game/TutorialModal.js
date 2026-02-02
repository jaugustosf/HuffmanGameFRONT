import React, { useState } from "react";
import { ArrowRight, Play, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const TutorialModal = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep(1), 300);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-500" /> Como Jogar
            (Passo {step}/3)
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="text-base h-36 flex flex-col justify-center text-neutral-600 dark:text-neutral-300">
              {step === 1 && (
                <div className="space-y-2">
                  <p>
                    <strong>Objetivo:</strong> Criar a árvore de compressão mais
                    eficiente possível.
                  </p>
                  <p>
                    No algoritmo de Huffman, as letras que aparecem{" "}
                    <strong>mais vezes</strong> devem ficar mais perto do topo
                    (código binário curto).
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-2">
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    A Regra de Ouro:
                  </p>
                  <p>
                    Olhe para a mesa e encontre os dois nós com os{" "}
                    <strong>MENORES NÚMEROS</strong> de frequência.
                  </p>
                  <p>Arraste um sobre o outro para conectá-los!</p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-2">
                  <p>
                    Isso criará um novo nó com a <strong>SOMA</strong> das
                    frequências.
                  </p>
                  <p>
                    Repita o processo até que todos os nós estejam conectados em
                    uma única árvore.
                  </p>
                  <p className="italic text-sm text-neutral-500 mt-2">
                    Dica: Se errar, use o botão direito do mouse para
                    desconectar.
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="flex w-full justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-neutral-500"
            >
              Pular
            </Button>

            {step < 3 ? (
              <Button onClick={handleNext}>
                Próximo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Entendi, vamos jogar! <Play className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
