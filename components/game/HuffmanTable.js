import React, { useMemo } from "react";
import { Table2, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HuffmanTable = ({ nodes, edges }) => {
  const { tableData, stats } = useMemo(() => {
    const leaves = nodes.filter((n) => n.id.startsWith("leaf-"));
    const data = [];
    let totalFrequency = 0;
    let huffmanBits = 0;

    leaves.forEach((leaf) => {
      let currentId = leaf.id;
      let code = "";

      // Percorre de baixo para cima
      while (true) {
        const parentEdge = edges.find((e) => e.target === currentId);
        if (!parentEdge) break;
        code = parentEdge.label + code;
        currentId = parentEdge.source;
      }

      const char = leaf.data.label.split(" ")[0];
      const freq = leaf.data.frequency;

      totalFrequency += freq;

      // Se não tem código (nó solto), assume 8 bits para penalizar a falta de compressão na métrica
      const currentBits = code.length > 0 ? freq * code.length : freq * 8;
      huffmanBits += currentBits;

      data.push({ char, freq, code: code || "-", bits: code.length || 8 });
    });

    // Ordenação: menor código primeiro -> maior frequência -> alfabética
    data.sort(
      (a, b) =>
        a.code.length - b.code.length ||
        b.freq - a.freq ||
        a.char.localeCompare(b.char),
    );

    const asciiBits = totalFrequency * 8;
    const bitsSaved = Math.max(0, asciiBits - huffmanBits); // Evita negativo
    const savings = asciiBits > 0 ? (bitsSaved / asciiBits) * 100 : 0;

    return {
      tableData: data,
      stats: { asciiBits, huffmanBits, bitsSaved, savings: savings.toFixed(1) },
    };
  }, [nodes, edges]);

  if (tableData.length === 0) return null;

  return (
    <Card className="shadow-md bg-white/90 backdrop-blur dark:bg-neutral-800/90 dark:border-neutral-700 gap-2">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
          <Table2 className="w-4 h-4" /> Tabela & Compressão
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 text-xs space-y-3">
        {/* TABELA */}
        <div className="rounded-md border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="grid grid-cols-3 bg-neutral-100 dark:bg-neutral-900 p-2 font-bold text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
            <span>Char</span>
            <span className="text-center">Binário</span>
            <span className="text-right">Bits Total</span>
          </div>
          <div className="max-h-[120px] overflow-y-auto custom-scrollbar">
            {tableData.map((row) => (
              <div
                key={row.char}
                className="grid grid-cols-3 p-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0 items-center hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
              >
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {row.char === "␣" ? "Espaço" : row.char}
                </span>
                <span className="text-center font-mono text-[10px] bg-neutral-100 dark:bg-neutral-950 rounded px-1 py-0.5 text-neutral-800 dark:text-neutral-200 truncate mx-1">
                  {row.code}
                </span>
                <span className="text-right text-neutral-500 font-mono">
                  {row.freq}x
                  {row.bits === 8 && row.code === "-" ? "8" : row.code.length} ={" "}
                  <strong>
                    {row.freq *
                      (row.bits === 8 && row.code === "-"
                        ? 8
                        : row.code.length)}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ESTATÍSTICAS DE ECONOMIA (NOVO LAYOUT) */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-col items-center p-2 bg-neutral-50 dark:bg-neutral-900 rounded-md border border-neutral-100 dark:border-neutral-800">
            <span>ASCII (8 bits)</span>
            <strong className="text-sm text-neutral-700 dark:text-neutral-200">
              {stats.asciiBits} bits
            </strong>
          </div>
          <div className="flex flex-col items-center p-2 bg-neutral-50 dark:bg-neutral-900 rounded-md border border-neutral-100 dark:border-neutral-800">
            <span>Huffman</span>
            <strong className="text-sm text-green-600 dark:text-green-400">
              {stats.huffmanBits} bits
            </strong>
          </div>
        </div>

        {/* BLOCO DE DESTAQUE DA ECONOMIA */}
        <div className="relative p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md flex items-center justify-between overflow-hidden">
          <div className="flex flex-col z-10">
            <span className="flex items-center gap-1 font-bold text-green-800 dark:text-green-400 uppercase tracking-wider text-[10px]">
              <ArrowDown className="w-3 h-3" /> Economia Real
            </span>
            <span className="text-green-600 dark:text-green-500 text-[10px] font-medium mt-0.5">
              {stats.bitsSaved} bits a menos
            </span>
          </div>

          <div className="z-10 text-right">
            <span className="font-black text-2xl text-green-700 dark:text-green-400 tracking-tight">
              {stats.savings}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
