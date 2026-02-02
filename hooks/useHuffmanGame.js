import { useState, useCallback, useEffect, useRef } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import axios from "axios";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { LEVELS, LEVEL_ORDER } from "@/data/gameLevels";

// Pega URL do ambiente ou usa localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const hasPositionChanged = (nodesA, nodesB) => {
  if (nodesA.length !== nodesB.length) return true;
  for (let i = 0; i < nodesA.length; i++) {
    const nodeA = nodesA[i];
    const nodeB = nodesB.find((n) => n.id === nodeA.id);
    if (!nodeB) return true;
    if (
      Math.round(nodeA.position.x) !== Math.round(nodeB.position.x) ||
      Math.round(nodeA.position.y) !== Math.round(nodeB.position.y)
    ) {
      return true;
    }
  }
  return false;
};

export const useHuffmanGame = () => {
  const [gameMode, setGameMode] = useState("campaign");
  const [currentLevelDiff, setCurrentLevelDiff] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [word, setWord] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [history, setHistory] = useState([]);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const [showEndCampaignModal, setShowEndCampaignModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const beforeDragSnapshot = useRef(null);

  // Inicializa a palavra da campanha
  useEffect(() => {
    if (gameMode === "campaign" && !word) {
      const diffKey = LEVEL_ORDER[currentLevelDiff];
      setWord(LEVELS[diffKey][currentWordIndex]);
    }
  }, [gameMode, currentLevelDiff, currentWordIndex, word]);

  // Detecção de Vitória
  useEffect(() => {
    if (nodes.length === 0) return;
    const activeNodes = nodes.filter((n) => !n.data.isUsed);
    const isVictory =
      activeNodes.length === 1 && activeNodes[0].id.startsWith("parent-");

    if (isVictory && !gameWon) {
      const timer = setTimeout(() => {
        setGameWon(true);
        toast.success("Árvore Montada!", {
          description: "Agora valide para continuar.",
        });
      }, 0);
      return () => clearTimeout(timer);
    } else if (!isVictory && gameWon) {
      const timer = setTimeout(() => {
        setGameWon(false);
        setLevelCompleted(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [nodes, gameWon]);

  const handleStartGame = async (wordToPlay = word) => {
    if (!wordToPlay.trim()) {
      toast.error("Campo vazio");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/game/start`,
        wordToPlay,
        {
          headers: { "Content-Type": "text/plain" },
        },
      );
      const javaNodes = response.data.initialNodes;

      const flowNodes = javaNodes.map((node, index) => {
        const displayLabel = node.character === " " ? "␣" : node.character;
        return {
          id: `leaf-${index}-${node.character}`,
          position: { x: index * 90 + 50, y: 500 },
          sourcePosition: "top",
          targetPosition: "top",
          data: {
            label: `${displayLabel} (${node.frequency})`,
            frequency: node.frequency,
            isUsed: false,
            level: 0,
          },
          type: "default",
          className: `${node.character === " " ? "bg-neutral-100 dark:bg-neutral-700" : "bg-white dark:bg-neutral-800"} dark:text-neutral-100 border-2 border-neutral-400 dark:border-neutral-600 rounded-lg shadow-sm font-bold flex justify-center items-center text-xs`,
          style: { width: 50, height: 50 },
        };
      });

      setHistory([]);
      setNodes(flowNodes);
      setEdges([]);
      setGameWon(false);
      setLevelCompleted(false);

      if (gameMode === "free") {
        setSuccessCount(0);
        setErrorCount(0);
        toast.success("Jogo Iniciado!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de Conexão. Verifique o Backend.");
    }
  };

  const handleNextLevel = () => {
    const diffKey = LEVEL_ORDER[currentLevelDiff];
    const currentList = LEVELS[diffKey];

    setNodes([]);
    setEdges([]);
    setHistory([]);
    setGameWon(false);
    setLevelCompleted(false);

    if (currentWordIndex + 1 < currentList.length) {
      const nextWord = currentList[currentWordIndex + 1];
      setCurrentWordIndex((prev) => prev + 1);
      setWord(nextWord);
      setTimeout(() => handleStartGame(nextWord), 100);
    } else {
      if (currentLevelDiff + 1 < LEVEL_ORDER.length) {
        const nextDiffIndex = currentLevelDiff + 1;
        const nextDiffKey = LEVEL_ORDER[nextDiffIndex];
        setCurrentLevelDiff(nextDiffIndex);
        setCurrentWordIndex(0);
        const nextWord = LEVELS[nextDiffKey][0];
        setWord(nextWord);
        toast.info(`Nível ${nextDiffKey} Desbloqueado!`);
        setTimeout(() => handleStartGame(nextWord), 100);
      } else {
        setShowEndCampaignModal(true);
        confetti({ particleCount: 500, spread: 180 });
      }
    }
  };

  const finishCampaignGoToFree = () => {
    setShowEndCampaignModal(false);
    setGameMode("free");
    setWord("");
    setNodes([]);
    setEdges([]);
    toast.success("Modo Livre Liberado! Divirta-se.");
  };

  const restartCampaign = () => {
    setShowEndCampaignModal(false);
    setGameMode("campaign");
    setCurrentLevelDiff(0);
    setCurrentWordIndex(0);
    setSuccessCount(0);
    setErrorCount(0);
    const firstWord = LEVELS.EASY[0];
    setWord(firstWord);
    setTimeout(() => handleStartGame(firstWord), 100);
    toast.info("Campanha Reiniciada!");
  };

  const handleValidateTree = async () => {
    const targets = new Set(edges.map((e) => e.target));
    const rootNode = nodes.find((n) => !targets.has(n.id) && !n.data.isUsed);

    if (!rootNode) {
      toast.error("Erro Estrutural", {
        description: "Sua árvore parece desconexa ou tem ciclos.",
      });
      return;
    }

    const treeStructure = nodes
      .filter((n) => n.id.startsWith("parent-"))
      .map((parentNode) => {
        const childrenEdges = edges.filter((e) => e.source === parentNode.id);
        const leftEdge = childrenEdges.find((e) => e.label === "0");
        const rightEdge = childrenEdges.find((e) => e.label === "1");
        return {
          parentId: parentNode.id,
          leftId: leftEdge ? leftEdge.target : null,
          rightId: rightEdge ? rightEdge.target : null,
          frequency: parentNode.data.frequency,
        };
      });

    const leafNodes = nodes
      .filter((n) => !n.id.startsWith("parent-"))
      .map((n) => ({
        id: n.id,
        character: n.data.label.split(" ")[0],
        frequency: n.data.frequency,
      }));

    const payload = { word: word, structure: treeStructure, leaves: leafNodes };

    try {
      const response = await axios.post(
        `${API_URL}/api/game/validate`,
        payload,
      );
      if (response.data.isValid) {
        toast.success("Perfeito!");
        setLevelCompleted(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      } else {
        toast.error("Quase lá!", { description: response.data.message });
        setErrorCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro na Validação");
    }
  };

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const lastSnapshot = history[history.length - 1];
    if (!lastSnapshot?.nodes) {
      setHistory((prev) => prev.slice(0, prev.length - 1));
      return;
    }
    setNodes(lastSnapshot.nodes);
    setEdges(lastSnapshot.edges);
    if (lastSnapshot.score) {
      setSuccessCount(lastSnapshot.score.success);
      setErrorCount(lastSnapshot.score.error);
    }
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setGameWon(false);
    setLevelCompleted(false);
    toast.info("Ação desfeita");
  }, [history, setNodes, setEdges]);

  // Hook do teclado para Undo (Ctrl+Z)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
        event.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo]);

  const onNodeDragStart = useCallback(() => {
    beforeDragSnapshot.current = {
      nodes: nodes.map((n) => ({
        ...n,
        position: { ...n.position },
        data: { ...n.data },
      })),
      edges: edges.map((e) => ({ ...e })),
      score: { success: successCount, error: errorCount },
    };
  }, [nodes, edges, successCount, errorCount]);

  const onNodeDragStop = useCallback(() => {
    if (!beforeDragSnapshot.current) return;
    if (hasPositionChanged(beforeDragSnapshot.current.nodes, nodes)) {
      const snapshotToSave = beforeDragSnapshot.current;
      setHistory((prev) => [...prev, snapshotToSave]);
    }
    beforeDragSnapshot.current = null;
  }, [nodes]);

  const isValidHuffmanMove = (nodeA, nodeB, allNodes) => {
    const availableNodes = allNodes.filter((n) => !n.data.isUsed);
    availableNodes.sort((a, b) => a.data.frequency - b.data.frequency);
    if (availableNodes.length < 2) return false;
    const min1 = availableNodes[0].data.frequency;
    const min2 = availableNodes[1].data.frequency;
    const selected1 = nodeA.data.frequency;
    const selected2 = nodeB.data.frequency;
    return (
      (selected1 === min1 && selected2 === min2) ||
      (selected1 === min2 && selected2 === min1)
    );
  };

  const confirmDelete = useCallback(() => {
    if (!nodeToDelete) return;

    setHistory((prev) => [
      ...prev,
      {
        nodes: nodes.map((n) => ({
          ...n,
          position: { ...n.position },
          data: { ...n.data },
        })),
        edges: edges.map((e) => ({ ...e })),
        score: { success: successCount, error: errorCount },
      },
    ]);

    const parentId = nodeToDelete;
    setEdges((currentEdges) => {
      const edgesDoPai = currentEdges.filter((e) => e.source === parentId);
      const idsDosFilhos = edgesDoPai.map((e) => e.target);
      setNodes((currentNodes) => {
        const nodesSemPai = currentNodes.filter((n) => n.id !== parentId);
        return nodesSemPai.map((n) => {
          if (idsDosFilhos.includes(n.id)) {
            return {
              ...n,
              data: { ...n.data, isUsed: false },
              style: { ...n.style, opacity: 1, pointerEvents: "all" },
            };
          }
          return n;
        });
      });
      return currentEdges.filter((e) => e.source !== parentId);
    });
    toast.success("Conexão desfeita.");
    setNodeToDelete(null);
  }, [
    nodeToDelete,
    setNodes,
    setEdges,
    successCount,
    errorCount,
    nodes,
    edges,
  ]);

  const onConnect = useCallback(
    (params) => {
      const { source, target } = params;
      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);

      if (!sourceNode || !targetNode || source === target) return;
      if (sourceNode.data.isUsed || targetNode.data.isUsed) {
        toast.warning("Nó ocupado");
        return;
      }

      if (!isValidHuffmanMove(sourceNode, targetNode, nodes)) {
        toast.error("Movimento Inválido!");
        setErrorCount((prev) => prev + 1);
        return;
      } else {
        setSuccessCount((prev) => prev + 1);
      }

      setHistory((prev) => [
        ...prev,
        {
          nodes: nodes.map((n) => ({
            ...n,
            position: { ...n.position },
            data: { ...n.data },
          })),
          edges: edges.map((e) => ({ ...e })),
          score: { success: successCount, error: errorCount },
        },
      ]);

      // Lógica visual da conexão
      const MIN_DISTANCE = 250;
      const IDEAL_GAP = 120;
      let finalSourceX = sourceNode.position.x;
      let finalTargetX = targetNode.position.x;
      const currentDistance = Math.abs(
        sourceNode.position.x - targetNode.position.x,
      );
      const levelA = sourceNode.data.level || 0;
      const levelB = targetNode.data.level || 0;

      if (currentDistance > MIN_DISTANCE && !(levelA > 0 && levelB > 0)) {
        if (levelA < levelB) {
          finalSourceX =
            sourceNode.position.x < targetNode.position.x
              ? targetNode.position.x - IDEAL_GAP
              : targetNode.position.x + IDEAL_GAP;
        } else if (levelB < levelA) {
          finalTargetX =
            targetNode.position.x < sourceNode.position.x
              ? sourceNode.position.x - IDEAL_GAP
              : sourceNode.position.x + IDEAL_GAP;
        } else {
          finalSourceX =
            sourceNode.position.x < targetNode.position.x
              ? targetNode.position.x - IDEAL_GAP
              : targetNode.position.x + IDEAL_GAP;
        }
      }
      const topY = Math.min(sourceNode.position.y, targetNode.position.y);
      const parentY = topY - 100;
      const centerA = finalSourceX + 40 / 2;
      const centerB = finalTargetX + 40 / 2;
      const parentX = Math.round((centerA + centerB) / 2 - 80 / 2);

      const newFrequency =
        sourceNode.data.frequency + targetNode.data.frequency;
      const newId = `parent-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newLevel = Math.max(levelA, levelB) + 1;

      const parentNode = {
        id: newId,
        position: { x: parentX, y: parentY },
        sourcePosition: "bottom",
        targetPosition: "top",
        data: {
          label: `${newFrequency}`,
          frequency: newFrequency,
          isUsed: false,
          level: newLevel,
        },
        type: "default",
        style: {
          backgroundColor: "#FFD700",
          fontWeight: "bold",
          border: "2px solid #b8860b",
          width: 80,
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          color: "#000",
        },
      };

      setNodes((nds) => {
        const cleanNodes = nds.filter((n) => n.id !== parentNode.id);
        return cleanNodes
          .map((node) => {
            if (node.id === source)
              return {
                ...node,
                position: { x: finalSourceX, y: topY },
                data: { ...node.data, isUsed: true },
                style: { ...node.style, opacity: 0.4, pointerEvents: "none" },
              };
            if (node.id === target)
              return {
                ...node,
                position: { x: finalTargetX, y: topY },
                data: { ...node.data, isUsed: true },
                style: { ...node.style, opacity: 0.4, pointerEvents: "none" },
              };
            return node;
          })
          .concat(parentNode);
      });

      setEdges((eds) => {
        const isSourceLeft = finalSourceX < finalTargetX;
        const commonStyle = { stroke: "var(--xy-edge-stroke)", strokeWidth: 2 };
        const labelStyle = {
          fontWeight: 600,
          fontSize: 12,
          fill: "var(--xy-edge-label)",
        };
        const edgeConfig = {
          type: "smoothstep",
          pathOptions: { borderRadius: 10 },
          style: commonStyle,
          labelStyle: labelStyle,
          animated: false,
        };

        const edge1 = {
          id: `e-${newId}-${source}`,
          source: newId,
          target: source,
          label: isSourceLeft ? "0" : "1",
          ...edgeConfig,
        };
        const edge2 = {
          id: `e-${newId}-${target}`,
          source: newId,
          target: target,
          label: isSourceLeft ? "1" : "0",
          ...edgeConfig,
        };
        return [
          ...eds.filter((e) => e.id !== edge1.id && e.id !== edge2.id),
          edge1,
          edge2,
        ];
      });
    },
    [
      nodes,
      edges,
      successCount,
      errorCount,
      isValidHuffmanMove,
      setNodes,
      setEdges,
    ],
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      if (node.id.startsWith("parent-")) {
        setNodeToDelete(node.id);
        return;
      }
      if (node.data.isUsed) {
        const parentEdge = edges.find((e) => e.target === node.id);
        if (parentEdge) setNodeToDelete(parentEdge.source);
      }
    },
    [edges],
  );

  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    setNodeToDelete(edge.source);
  }, []);

  return {
    gameMode,
    currentLevelDiff,
    currentWordIndex,
    word,
    setWord,
    nodes,
    edges,
    history,
    gameWon,
    levelCompleted,
    showEndCampaignModal,
    setShowEndCampaignModal,
    showTutorial,
    setShowTutorial,
    successCount,
    errorCount,
    nodeToDelete,
    setNodeToDelete,
    onNodesChange,
    onEdgesChange,
    handleStartGame,
    handleNextLevel,
    handleValidateTree,
    restartCampaign,
    finishCampaignGoToFree,
    undo,
    onConnect,
    onNodeDragStart,
    onNodeDragStop,
    onNodeContextMenu,
    onEdgeContextMenu,
    confirmDelete,
  };
};
