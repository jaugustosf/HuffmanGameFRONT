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
import { HuffmanTable } from "@/components/game/HuffmanTable";

const HuffmanBoard = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const game = useHuffmanGame();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-[90vh] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm relative bg-neutral-50 dark:bg-[#1B1B1B] overflow-hidden">
      <GameControls
        gameMode={game.gameMode}
        levelName={LEVEL_ORDER[game.currentLevelDiff]}
        word={game.word}
        setWord={game.setWord}
        currentWordIndex={game.currentWordIndex}
        totalWordsInLevel={LEVELS[LEVEL_ORDER[game.currentLevelDiff]].length}
        mounted={mounted}
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

      <div className="absolute top-4 right-4 z-10 w-80 flex flex-col gap-3 max-h-[90vh] overflow-y-auto pr-1 pb-4 scrollbar-hide">
        <GameInfo
          gameMode={game.gameMode}
          successCount={game.successCount}
          errorCount={game.errorCount}
        />

        <div
          className={`transition-all duration-500 ease-in-out ${game.levelCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"}`}
        >
          {game.levelCompleted && (
            <HuffmanTable nodes={game.nodes} edges={game.edges} />
          )}
        </div>
      </div>

      <ReactFlow
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
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
        style={{
          color: resolvedTheme === "dark" ? "#fff" : "#000",
        }}
      >
        <Background
          gap={20}
          color={resolvedTheme === "dark" ? "#555555" : "#000000"}
          variant="dots"
        />

        <Controls className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 [&>button]:text-black dark:[&>button]:text-white [&>button]:fill-black dark:[&>button]:fill-white [&>button:hover]:bg-neutral-100 dark:[&>button:hover]:bg-neutral-700 [&>button]:border-b-neutral-200 dark:[&>button]:border-b-neutral-700" />
      </ReactFlow>

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
