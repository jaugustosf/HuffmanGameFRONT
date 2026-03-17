import { createClient } from "redis";
import { NextResponse } from "next/server";

const REDIS_URL = process.env.REDIS_URL;

export async function GET() {
  const client = createClient({ url: REDIS_URL });
  
  try {
    await client.connect();
    
    // Busca os 10 melhores
    const rankingRaw = await client.zRangeWithScores("huffman_ranking", 0, 9, {
      REV: true,
    });
    
    const formattedRanking = rankingRaw.map((item) => ({
      name: item.value,
      score: item.score,
    }));

    return NextResponse.json({ ranking: formattedRanking });
  } catch (error) {
    console.error("ERRO NO REDIS GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client.isOpen) await client.quit();
  }
}

export async function POST(request) {
  const client = createClient({ url: REDIS_URL });

  try {
    const { playerName, score } = await request.json();

    if (!playerName || score === undefined) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    await client.connect();
    
    // zIncrBy soma o score enviado ao score que já existe no Redis para esse jogador
    await client.zIncrBy("huffman_ranking", score, playerName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO NO REDIS POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client.isOpen) await client.quit();
  }
}
