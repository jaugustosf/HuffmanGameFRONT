import React, { useState, useEffect } from "react";
import { Trophy, X, Medal, Loader2 } from "lucide-react";

export const LeaderboardModal = ({ open, onClose }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toda vez que o modal abrir, ele busca os dados fresquinhos na sua API
  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/api/ranking")
        .then((res) => res.json())
        .then((data) => {
          setRanking(data.ranking || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao carregar ranking:", err);
          setLoading(false);
        });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* CABEÇALHO */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase tracking-wider">
              Top 10 Jogadores
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* LISTA DO RANKING */}
        <div className="p-4 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : ranking.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Ninguém pontuou ainda. Jogue e seja o primeiro!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {ranking.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    {index === 0 ? (
                      <Medal className="w-6 h-6 text-yellow-500" />
                    ) : index === 1 ? (
                      <Medal className="w-6 h-6 text-gray-400" />
                    ) : index === 2 ? (
                      <Medal className="w-6 h-6 text-amber-700" />
                    ) : (
                      <span className="w-6 text-center font-bold text-neutral-400">
                        #{index + 1}
                      </span>
                    )}

                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {player.name}
                    </span>
                  </div>
                  <div className="font-black text-amber-600 dark:text-amber-500">
                    {player.score} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
