import React, { useState } from "react";
import { ArrowRight, Play, GraduationCap, ChevronLeft } from "lucide-react";
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
  const handleBack = () => setStep((prev) => prev - 1);
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep(1), 300);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-2xl w-[95vw]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-500" /> Tutorial
            (Passo {step}/4)
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="text-base flex flex-col justify-start text-neutral-600 dark:text-neutral-300 overflow-y-auto pr-2 custom-scrollbar mt-4 transition-all duration-300">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                      <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-1 text-sm uppercase tracking-tight">O que é Huffman?</h4>
                      <p className="text-[13px] leading-relaxed">
                        É um método de <strong>compressão</strong> que cria códigos binários curtos para o que é comum e longos para o que é raro.
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                      <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-1 text-sm uppercase tracking-tight">Estratégia Bottom-Up</h4>
                      <p className="text-[13px] leading-relaxed">
                        Diferente de outros modelos, o Huffman constrói a árvore <strong>de baixo para cima</strong>, unindo as menores partes primeiro.
                      </p>
                    </div>
                  </div>

                  {/* Container centralizado e com fundo branco para integrar o GIF */}
                  <div className="bg-white rounded-2xl p-4 md:p-8 border border-neutral-200 shadow-sm flex items-center justify-center">
                    <div className="relative w-full flex items-center justify-center">
                      <img 
                        src="/huffman-demo.gif" 
                        alt="Demonstração Huffman"
                        className="max-w-full h-auto max-h-[350px] object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.nextSibling.style.display = 'flex';
                        }}
                      />
                    </div>
                    <div className="hidden flex-col items-center gap-2 text-neutral-400 p-8 text-center bg-neutral-50 dark:bg-neutral-900 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 w-full min-h-[250px] justify-center">
                      <GraduationCap className="w-10 h-10 opacity-20" />
                      <p className="text-xs font-medium">Demonstração Visual do Algoritmo</p>
                      <p className="text-[10px] opacity-60">Salve o arquivo em public/huffman-demo.gif</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-60 flex flex-col justify-center">
                  <p className="text-lg text-center px-4">
                    <strong>Objetivo:</strong> Construir a árvore conectando as letras da palavra de forma eficiente.
                  </p>
                  <p className="text-neutral-500 text-center">
                    Quanto menor o caminho das letras frequentes até a raiz, <strong>maior será sua pontuação!</strong>
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 h-60 flex flex-col justify-center">
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 shadow-sm">
                    <p className="font-bold text-xl text-green-700 dark:text-green-400 mb-3 text-center">
                      A Regra de Ouro:
                    </p>
                    <p className="text-lg leading-relaxed text-center">
                      Selecione os dois nós com as <strong>MENORES FREQUÊNCIAS</strong> (números) disponíveis.
                    </p>
                  </div>
                  <p className="text-center italic font-medium text-blue-600 dark:text-blue-400">
                    Clique no primeiro nó e depois no segundo para fundi-los!
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 min-h-[240px] flex flex-col justify-center pb-4">
                  <div className="space-y-3 text-center">
                    <p className="text-lg">
                      A união cria um novo nó com a <strong>SOMA</strong> das frequências dos filhos.
                    </p>
                    <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                      Continue clicando e unindo até que reste apenas 1 nó raiz!
                    </p>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <h5 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-3 text-center">Dicas Rápidas</h5>
                    <ul className="text-sm space-y-2 text-neutral-600 dark:text-neutral-400">
                      <li className="flex gap-2"><span>•</span> <span><strong>Botão Direito:</strong> Remove uma conexão se você errar.</span></li>
                      <li className="flex gap-2"><span>•</span> <span><strong>Seleção:</strong> O primeiro nó clicado fica destacado em azul.</span></li>
                      <li className="flex gap-2"><span>•</span> <span><strong>Mobile:</strong> Use o botão "i" para ver o placar e as regras.</span></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="flex w-full justify-between items-center pt-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Pular
              </Button>
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="gap-1 border-neutral-200 dark:border-neutral-800"
                >
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
              )}
            </div>

            {step < 4 ? (
              <Button onClick={handleNext} className="gap-2">
                Próximo <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                Entendi, vamos jogar! <Play className="w-4 h-4" />
              </Button>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
