import React, { useState } from "react";
import { User } from "lucide-react";

export const PlayerNameModal = ({ open, onSave }) => {
  const [name, setName] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length >= 3) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-xl shadow-xl w-full max-w-sm mx-4 transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            Identifique-se!
          </h2>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5">
          Como devemos te chamar no Placar Global de líderes?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome ou apelido..."
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            autoFocus
            maxLength={15}
          />

          <button
            type="submit"
            disabled={name.trim().length < 3}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Salvar e Continuar
          </button>
        </form>
      </div>
    </div>
  );
};
