import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Durante o build do Next.js, as variáveis podem não estar presentes.
    // Retornamos um erro amigável apenas quando a rota for chamada de fato.
    throw new Error("Supabase URL and Anon Key are required environment variables.");
  }

  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("ranking")
      .select("player_name, score")
      .order("score", { ascending: false })
      .limit(10);

    if (error) throw error;

    const formattedRanking = data.map((item) => ({
      name: item.player_name,
      score: item.score,
    }));

    return NextResponse.json({ ranking: formattedRanking });
  } catch (error) {
    console.error("Erro no Supabase GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabase();
    const { playerName, score } = await request.json();

    if (!playerName || score === undefined) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { error } = await supabase
      .from("ranking")
      .insert([{ player_name: playerName, score: score }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no Supabase POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
