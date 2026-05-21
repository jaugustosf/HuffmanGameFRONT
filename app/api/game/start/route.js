import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const text = await request.text();

    if (!text || text.trim() === "") {
      return NextResponse.json({ initialNodes: [] });
    }

    const frequencyMap = {};
    const upperText = text.toUpperCase();

    for (const char of upperText) {
      frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }

    const initialNodes = Object.entries(frequencyMap)
      .map(([character, frequency]) => ({
        character,
        frequency,
      }))
      .sort((a, b) => a.frequency - b.frequency);

    return NextResponse.json({ initialNodes });
  } catch (error) {
    console.error("Error in /api/game/start:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
