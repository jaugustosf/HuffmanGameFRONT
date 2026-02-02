import React, { useEffect, useState } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";

// --- IMPORTS ---
import { LEVEL_ORDER, LEVELS } from "@/data/gameLevels";
import { useHuffmanGame } from "@/hooks/useHuffmanGame"; // <--- O CÉREBRO
import { GameControls } from "@/components/game/GameControls";
import { GameInfo } from "@/components/game/GameInfo";
import { TutorialModal } from "@/components/game/TutorialModal";
import { DeleteModal } from "@/components/game/DeleteModal";
import { GameOverModal } from "@/components/game/GameOverModal";

const HuffmanBoard = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Puxa TODA a lógica do hook
  const game = useHuffmanGame();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full h-[90vh] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm relative bg-neutral-50 dark:bg-[#1B1B1B] overflow-hidden transition-colors duration-300"
      style={{
        "--xy-edge-stroke": "var(--flow-edge)", // Usa a variável CSS
        "--xy-edge-label": "var(--flow-edge)",
      }}
    >
      {/* 1. CONTROLES (ESQUERDA) */}
      <GameControls
        gameMode={game.gameMode}
        levelName={LEVEL_ORDER[game.currentLevelDiff]}
        word={game.word}
        setWord={game.setWord}
        currentWordIndex={game.currentWordIndex}
        totalWordsInLevel={LEVELS[LEVEL_ORDER[game.currentLevelDiff]].length}
        mounted={mounted}
        theme={theme}
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
      >
        <Background gap={20} color="#000000" style={{ opacity: 0.2 }} />
        <Controls />
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
