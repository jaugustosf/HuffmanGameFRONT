import { createClient } from "redis";
import { NextResponse } from "next/server";

// Puxa a URL que você confirmou que começa com "redis://"
const REDIS_URL = process.env.REDIS_URL;

export async function GET() {
  const client = createClient({ url: REDIS_URL });

  try {
    await client.connect();

    // Busca os 10 melhores
    const rankingRaw = await client.zRangeWithScores("huffman_ranking", 0, 9, {
      REV: true,
    });

    // Ajuste aqui: a biblioteca 'redis' retorna { value, score }
    // Vamos transformar em { name, score } para o seu Front-end entender
    const formattedRanking = rankingRaw.map((item) => ({
      name: item.value, // O Redis chama o nome de 'value'
      score: item.score,
    }));

    return NextResponse.json({ ranking: formattedRanking });
  } catch (error) {
    console.error("Erro no Redis GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.quit();
  }
}

export async function POST(request) {
  const client = createClient({ url: REDIS_URL });

  try {
    const { playerName, score } = await request.json();

    await client.connect();
    // ZADD adiciona o score ao ranking
    await client.zAdd("huffman_ranking", {
      score: score,
      value: playerName,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no Redis POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.quit();
  }
}
