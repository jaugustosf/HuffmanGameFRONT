import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
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

    // Busca o jogador atual para ver se ele já existe
    const { data: existingPlayer, error: fetchError } = await supabase
      .from("ranking")
      .select("score")
      .eq("player_name", playerName)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 é "não encontrado"
      throw fetchError;
    }

    if (existingPlayer) {
      // Se existe, soma o score novo ao que já tem
      const newTotalScore = existingPlayer.score + score;
      const { error: updateError } = await supabase
        .from("ranking")
        .update({ score: newTotalScore })
        .eq("player_name", playerName);
      
      if (updateError) throw updateError;
    } else {
      // Se não existe, cria novo
      const { error: insertError } = await supabase
        .from("ranking")
        .insert([{ player_name: playerName, score: score }]);
      
      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no Supabase POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
