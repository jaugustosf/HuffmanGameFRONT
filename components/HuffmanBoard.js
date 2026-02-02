import React, { useEffect, useState } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";

import { LEVEL_ORDER, LEVELS } from "@/data/gameLevels";
import { useHuffmanGame } from "@/hooks/useHuffmanGame";
import { GameControls } from "@/components/game/GameControls";
import { GameInfo } from "@/components/game/GameInfo";
import { TutorialModal } from "@/components/game/TutorialModal";
import { DeleteModal } from "@/components/game/DeleteModal";
import { GameOverModal } from "@/components/game/GameOverModal";

const HuffmanBoard = () => {
  // TRUQUE 1: Pegar o resolvedTheme para saber a cor real
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hook principal de lógica
  const game = useHuffmanGame();

  useEffect(() => {
    // TRUQUE 2: Silenciar o aviso de setState no effect (necessário para theme mismatch)
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // Se não montou, não renderiza nada para evitar flash
  if (!mounted) return null;

  return (
    <div className="w-full h-[90vh] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm relative bg-neutral-50 dark:bg-[#1B1B1B] overflow-hidden">
      {/* 1. CONTROLES (ESQUERDA) */}
      <GameControls
        gameMode={game.gameMode}
        levelName={LEVEL_ORDER[game.currentLevelDiff]}
        word={game.word}
        setWord={game.setWord}
        currentWordIndex={game.currentWordIndex}
        totalWordsInLevel={LEVELS[LEVEL_ORDER[game.currentLevelDiff]].length}
        mounted={mounted}
        // Passamos o tema RESOLVIDO para o controle exibir o ícone certo
        theme={resolvedTheme}
        setTheme={setTheme}
        nodesLength={game.nodes.length}
        historyLength={game.history.length}
        gameWon={game.gameWon}
        levelCompleted={game.levelCompleted}
        onStartGame={game.handleStartGame}
        onUndo={game.undo}
        onValidate={game.handleValidateTree}
        onNextLevel={game.handleNextLevel}
      />

      {/* 2. INFO (DIREITA) */}
      <GameInfo
        gameMode={game.gameMode}
        successCount={game.successCount}
        errorCount={game.errorCount}
      />

      {/* 3. TABULEIRO (REACT FLOW) */}
      <ReactFlow
        // TRUQUE 3: Key força redesenho ao trocar tema
        key={resolvedTheme}
        nodes={game.nodes}
        edges={game.edges}
        onNodesChange={game.onNodesChange}
        onEdgesChange={game.onEdgesChange}
        onConnect={game.onConnect}
        onEdgeContextMenu={game.onEdgeContextMenu}
        onNodeContextMenu={game.onNodeContextMenu}
        onNodeDragStart={game.onNodeDragStart}
        onNodeDragStop={game.onNodeDragStop}
        fitView
        // Define o modo explicitamente
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
        style={{
          color: resolvedTheme === "dark" ? "#fff" : "#000",
        }}
      >
        <Background
          gap={20}
          color={resolvedTheme === "dark" ? "#555555" : "#e5e5e5"}
          variant="dots"
        />

        {/* TRUQUE 4: Estilização manual dos controles via Tailwind */}
        <Controls className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 [&>button]:text-black dark:[&>button]:text-white [&>button]:fill-black dark:[&>button]:fill-white [&>button:hover]:bg-neutral-100 dark:[&>button:hover]:bg-neutral-700 [&>button]:border-b-neutral-200 dark:[&>button]:border-b-neutral-700" />
      </ReactFlow>

      {/* 4. MODAIS */}
      <TutorialModal
        open={game.showTutorial}
        onOpenChange={game.setShowTutorial}
      />

      <DeleteModal
        isOpen={!!game.nodeToDelete}
        onClose={() => game.setNodeToDelete(null)}
        onConfirm={game.confirmDelete}
      />

      <GameOverModal
        isOpen={game.showEndCampaignModal}
        successCount={game.successCount}
        errorCount={game.errorCount}
        onRestart={game.restartCampaign}
        onGoToFreeMode={game.finishCampaignGoToFree}
      />
    </div>
  );
};

export default HuffmanBoard;
