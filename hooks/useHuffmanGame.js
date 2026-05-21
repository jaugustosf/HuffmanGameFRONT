import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import axios from "axios";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { LEVELS, LEVEL_ORDER } from "@/data/gameLevels";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

  const [levelCompleted, setLevelCompleted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const [showEndCampaignModal, setShowEndCampaignModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  // === SISTEMA DE PONTOS (COMBOS) ===
  const [score, setScore] = useState(0);
  const [successStreak, setSuccessStreak] = useState(0);
  const [errorStreak, setErrorStreak] = useState(0);

  const beforeDragSnapshot = useRef(null);
  const draggingDescendants = useRef([]);

  const [playerName, setPlayerName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [firstSelectedNodeId, setFirstSelectedNodeId] = useState(null);

  // Verifica se o usuário já tem um nome salvo
  useEffect(() => {
    const savedName = localStorage.getItem("@HuffmanGame:playerName");
    if (savedName) {
      setPlayerName(savedName);
    } else {
      setTimeout(() => setShowNameModal(true), 1500);
    }
  }, []);

  const handleSaveName = useCallback((name) => {
    setPlayerName(name);
    localStorage.setItem("@HuffmanGame:playerName", name);
    setShowNameModal(false);
  }, []);

  useEffect(() => {
    if (gameMode === "campaign" && !word) {
      const diffKey = LEVEL_ORDER[currentLevelDiff];
      setWord(LEVELS[diffKey][currentWordIndex]);
    }
  }, [gameMode, currentLevelDiff, currentWordIndex, word]);

  const handleStartGame = async (wordToPlay = word) => {
    if (!wordToPlay.trim()) {
      toast.error("Campo vazio");
      return;
    }

    setNodes([]);
    setEdges([]);
    setHistory([]);
    setLevelCompleted(false);
    setIsValidating(false);
    setFirstSelectedNodeId(null);

    // Zera apenas os combos na nova fase. O SCORE continua acumulando!
    setSuccessStreak(0);
    setErrorStreak(0);

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
          className: `${node.character === " " ? "bg-neutral-100 dark:bg-neutral-700" : "bg-white dark:bg-neutral-800"} dark:text-neutral-100 border-2 border-neutral-400 dark:border-neutral-600 rounded-lg shadow-sm font-bold flex justify-center items-center text-xs transition-all`,
          style: { width: 50, height: 50 },
        };
      });

      setNodes(flowNodes);

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
    setLevelCompleted(false);
    setIsValidating(false);
    setFirstSelectedNodeId(null);

    if (currentWordIndex + 1 < currentList.length) {
      // Tem mais palavras neste nível
      const nextWord = currentList[currentWordIndex + 1];
      setCurrentWordIndex((prev) => prev + 1);
      setWord(nextWord);
      setTimeout(() => handleStartGame(nextWord), 100);
    } else {
      // Acabou as palavras deste nível, tenta ir pro próximo nível
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
        // === FIM DA CAMPANHA (TODOS OS DESAFIOS FINALIZADOS) ===
        setShowEndCampaignModal(true);
        confetti({ particleCount: 500, spread: 180 });

        // === SALVA NO BANCO DE DADOS DA VERCEL ===
        if (playerName && score > 0) {
          fetch("/api/ranking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerName: playerName, score: score }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Salvo no banco!", data);
              // Espera 1.5s pra pessoa ver os confetes antes de abrir o placar
              setTimeout(() => setShowLeaderboard(true), 1500);
            })
            .catch((err) => console.error("Erro ao salvar no ranking:", err));
        }
      }
    }
  };

  const finishCampaignGoToFree = () => {
    setShowEndCampaignModal(false);
    setGameMode("free");
    setWord("");
    setNodes([]);
    setEdges([]);
    setFirstSelectedNodeId(null);

    // Zera os pontos para o modo livre
    setScore(0);
    setSuccessStreak(0);
    setErrorStreak(0);

    toast.success("Modo Livre Liberado! Divirta-se.");
  };

  const restartCampaign = () => {
    setShowEndCampaignModal(false);
    setGameMode("campaign");
    setCurrentLevelDiff(0);
    setCurrentWordIndex(0);
    setSuccessCount(0);
    setErrorCount(0);
    setFirstSelectedNodeId(null);

    // Zera os pontos para a nova campanha
    setScore(0);
    setSuccessStreak(0);
    setErrorStreak(0);

    const firstWord = LEVELS.EASY[0];
    setWord(firstWord);
    setTimeout(() => handleStartGame(firstWord), 100);
    toast.info("Campanha Reiniciada!");
  };

  const handleValidateTree = useCallback(() => {
    const activeNodes = nodes.filter((n) => !n.data.isUsed);

    if (activeNodes.length !== 1 || levelCompleted || isValidating) return;

    const rootNode = activeNodes[0];

    if (!rootNode.id.startsWith("parent-")) return;

    setIsValidating(true);

    // Bônus equalizado para 35
    const levelBonus = 35;

    // Atualiza o score com o bônus antes de mostrar a notificação
    setScore((curr) => {
      const finalScore = curr + levelBonus;

      const timer = setTimeout(() => {
        toast.success("Árvore Completa!", {
          description: `Fase concluída! +1250 Bônus. Score: ${finalScore}`,
        });

        setLevelCompleted(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

        setIsValidating(false);
      }, 100);

      return finalScore;
    });

    // Como o timer agora está dentro do setScore, não precisamos retornar o clearTimeout aqui da mesma forma,
    // mas por segurança e para evitar warnings do React, mantemos a estrutura de dependências limpa.
  }, [nodes, levelCompleted, isValidating]);

  useEffect(() => {
    const activeNodes = nodes.filter((n) => !n.data.isUsed);

    if (
      activeNodes.length === 1 &&
      activeNodes[0].id.startsWith("parent-") &&
      !levelCompleted &&
      !isValidating
    ) {
      const timer = setTimeout(() => {
        handleValidateTree();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [nodes, levelCompleted, isValidating, handleValidateTree]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const lastSnapshot = history[history.length - 1];

    // Restaura os nós garantindo que nenhum esteja selecionado
    setNodes(lastSnapshot.nodes.map((n) => ({ ...n, selected: false })));
    setEdges(lastSnapshot.edges);
    setSuccessCount(lastSnapshot.score?.success || 0);
    setErrorCount(lastSnapshot.score?.error || 0);
    setFirstSelectedNodeId(null);

    // Restaura o score exato de antes
    setScore(lastSnapshot.score?.points || 0);
    setSuccessStreak(lastSnapshot.score?.successStreak || 0);
    setErrorStreak(lastSnapshot.score?.errorStreak || 0);

    setHistory((prev) => prev.slice(0, prev.length - 1));
    setLevelCompleted(false);
    setIsValidating(false);
    toast.info("Ação desfeita");
  }, [history, setNodes, setEdges]);

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

  const onNodeDragStart = useCallback(
    (event, node) => {
      beforeDragSnapshot.current = {
        nodes: nodes.map((n) => ({
          ...n,
          position: { ...n.position },
          data: { ...n.data },
        })),
        edges: edges.map((e) => ({ ...e })),
        score: {
          success: successCount,
          error: errorCount,
          points: score,
          successStreak,
          errorStreak,
        },
      };

      // === LÓGICA DE SEGUIR PAI ===
      const descendants = [];
      const stack = [node.id];
      while (stack.length > 0) {
        const pId = stack.pop();
        const childrenIds = edges
          .filter((e) => e.source === pId)
          .map((e) => e.target);
        descendants.push(...childrenIds);
        stack.push(...childrenIds);
      }

      draggingDescendants.current = descendants.map((id) => {
        const n = nodes.find((nds) => nds.id === id);
        return {
          id,
          offsetX: n.position.x - node.position.x,
          offsetY: n.position.y - node.position.y,
        };
      });
    },
    [
      nodes,
      edges,
      successCount,
      errorCount,
      score,
      successStreak,
      errorStreak,
    ],
  );

  const onNodeDrag = useCallback(
    (event, node) => {
      if (draggingDescendants.current.length === 0) return;

      setNodes((nds) =>
        nds.map((n) => {
          const descendant = draggingDescendants.current.find(
            (d) => d.id === n.id,
          );
          if (descendant) {
            return {
              ...n,
              position: {
                x: node.position.x + descendant.offsetX,
                y: node.position.y + descendant.offsetY,
              },
            };
          }
          return n;
        }),
      );
    },
    [setNodes],
  );

  const onNodeDragStop = useCallback(() => {
    if (!beforeDragSnapshot.current) return;
    if (hasPositionChanged(beforeDragSnapshot.current.nodes, nodes)) {
      const snapshotToSave = beforeDragSnapshot.current;
      setHistory((prev) => [...prev, snapshotToSave]);
    }
    beforeDragSnapshot.current = null;
    draggingDescendants.current = [];
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
        score: {
          success: successCount,
          error: errorCount,
          points: score,
          successStreak,
          errorStreak,
        },
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
    score,
    successStreak,
    errorStreak,
    nodes,
    edges,
  ]);

  const executeUnion = useCallback(
    (source, target) => {
      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);

      if (!sourceNode || !targetNode || source === target) return;
      if (sourceNode.data.isUsed || targetNode.data.isUsed) {
        toast.warning("Nó ocupado");
        return;
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
          score: {
            success: successCount,
            error: errorCount,
            points: score,
            successStreak,
            errorStreak,
          },
        },
      ]);

      // === VALIDAÇÃO DE PONTOS (ARCADE MODE CORRIGIDO) ===
      if (!isValidHuffmanMove(sourceNode, targetNode, nodes)) {
        toast.error("Movimento Inválido!", {
          description: "Una sempre os menores valores.",
        });
        setErrorCount((prev) => prev + 1);

        const newErrStreak = errorStreak + 1;
        const penalty = Math.round(75 * Math.pow(1.2, newErrStreak - 1));

        setSuccessStreak(0);
        setErrorStreak(newErrStreak);
        setScore((curr) => Math.max(0, curr - penalty));

        return;
      } else {
        setSuccessCount((prev) => prev + 1);

        const newSuccStreak = successStreak + 1;
        const reward = Math.round(125 * Math.pow(1.5, newSuccStreak - 1));

        setErrorStreak(0);
        setSuccessStreak(newSuccStreak);
        setScore((curr) => curr + reward);
      }

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
        const commonStyle = { strokeWidth: 2 };
        const labelStyle = { fontWeight: 600, fontSize: 12 };
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
      score,
      successStreak,
      errorStreak,
      isValidHuffmanMove,
      setNodes,
      setEdges,
    ],
  );

  const onConnect = useCallback(
    (params) => {
      executeUnion(params.source, params.target);
    },
    [executeUnion],
  );

  const onPaneClick = useCallback(() => {
    if (firstSelectedNodeId) {
      setFirstSelectedNodeId(null);
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
    }
  }, [firstSelectedNodeId, setNodes]);

  const onNodeClick = useCallback(
    (event, node) => {
      if (node.data.isUsed) return;

      // Se clicar no nó que já é o primeiro selecionado, desseleciona
      if (firstSelectedNodeId === node.id) {
        setFirstSelectedNodeId(null);
        setNodes((nds) =>
          nds.map((n) => (n.id === node.id ? { ...n, selected: false } : n)),
        );
        return;
      }

      if (!firstSelectedNodeId) {
        // Primeiro clique: seleciona
        setFirstSelectedNodeId(node.id);
        setNodes((nds) =>
          nds.map((n) => (n.id === node.id ? { ...n, selected: true } : n)),
        );
      } else {
        // Segundo clique em nó diferente: realiza a união
        executeUnion(firstSelectedNodeId, node.id);
        setFirstSelectedNodeId(null);
        // Limpar seleção de todos após tentativa
        setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
      }
    },
    [firstSelectedNodeId, executeUnion, setNodes],
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
    levelCompleted,
    showEndCampaignModal,
    setShowEndCampaignModal,
    showTutorial,
    setShowTutorial,
    successCount,
    errorCount,

    // Exportados de Pontuação
    score,
    successStreak,
    errorStreak,

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
    onNodeClick,
    onPaneClick,
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
    onNodeContextMenu,
    onEdgeContextMenu,
    confirmDelete,

    playerName,
    showNameModal,
    handleSaveName,

    showLeaderboard,
    setShowLeaderboard,
  };
};
