import React, { useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Trophy, Info, X, GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";
import { useHuffmanGame } from "@/hooks/useHuffmanGame";
import { GameControls } from "./game/GameControls";
import { GameInfo } from "./game/GameInfo";
import { HuffmanTable } from "./game/HuffmanTable";
import { GameOverModal } from "./game/GameOverModal";
import { TutorialModal } from "./game/TutorialModal";
import { DeleteModal } from "./game/DeleteModal";
import { PlayerNameModal } from "./game/Modals/PlayerNameModal";
import { LeaderboardModal } from "./game/Modals/LeaderboardModal";
import HuffmanNode from "./game/HuffmanNode";
import { LEVELS, LEVEL_ORDER } from "@/data/gameLevels";

const nodeTypes = {
  huffman: HuffmanNode,
};

const HuffmanBoard = () => {
  const game = useHuffmanGame();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* === CABEÇALHO (Título centralizado + Botão na direita) === */}
      <div className="relative w-full flex items-center justify-between shrink-0 py-2 px-2">
        <div className="w-10 md:hidden" /> {/* Spacer para equilibrar o Ranking no mobile */}
        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 m-0">
          Jogo de Huffman
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => game.setShowTutorial(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden md:inline">Explicação</span>
          </button>

          <button
            onClick={() => game.setShowLeaderboard(true)}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden md:inline">Ranking</span>
          </button>
        </div>
      </div>

      {/* === SEU TABULEIRO ORIGINAL === */}
      <div className="w-full h-[91.2vh] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm relative bg-neutral-50 dark:bg-[#1B1B1B] overflow-hidden">
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

        {/* Botão de Toggle para Mobile */}
        <button
          onClick={() => setIsMobileInfoOpen(!isMobileInfoOpen)}
          className="md:hidden absolute top-4 right-4 z-[20] flex items-center justify-center w-10 h-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-lg text-neutral-700 dark:text-neutral-200 transition-all active:scale-95"
          aria-label="Ver Informações"
        >
          {isMobileInfoOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Info className="w-6 h-6" />
          )}
        </button>

        <div
          className={`absolute top-4 right-4 z-10 w-[85vw] sm:w-80 flex flex-col gap-3 max-h-[85vh] overflow-y-auto p-3 pb-4 scrollbar-hide transition-all duration-300 ease-in-out
          ${
            isMobileInfoOpen
              ? "translate-x-0 opacity-100 flex bg-white/95 dark:bg-[#1B1B1B]/95 backdrop-blur-sm rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl mt-12"
              : "translate-x-full opacity-0 md:translate-x-0 md:opacity-100 hidden md:flex"
          }`}
        >
          <GameInfo
            gameMode={game.gameMode}
            successCount={game.successCount}
            errorCount={game.errorCount}
            score={game.score} // <--- Essa linha é OBRIGATÓRIA para o número mudar na tela
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
          onNodeClick={game.onNodeClick}
          onPaneClick={game.onPaneClick}
          onEdgeContextMenu={game.onEdgeContextMenu}
          onNodeContextMenu={game.onNodeContextMenu}
          onNodeDragStart={game.onNodeDragStart}
          onNodeDrag={game.onNodeDrag}
          onNodeDragStop={game.onNodeDragStop}
          fitView
          nodeTypes={nodeTypes}
          nodesConnectable={false}
          colorMode={resolvedTheme === "dark" ? "dark" : "light"}
          selectNodesOnDrag={false}
          selectionOnDrag={false}
          elementsSelectable={true}
          style={{
            color: resolvedTheme === "dark" ? "#fff" : "#000",
            userSelect: "none",
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

        <PlayerNameModal
          open={game.showNameModal}
          onSave={game.handleSaveName}
        />

        <LeaderboardModal
          open={game.showLeaderboard}
          onClose={() => game.setShowLeaderboard(false)}
        />
      </div>
    </div>
  );
};

export default HuffmanBoard;
