import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  const results = {
    edge_runtime: "OK",
    supabase_connection: "PENDING",
    database_data: null,
    test_frequency_logic: { T: 2, E: 2, S: 1 },
    env_vars_present: {
      url: !!supabaseUrl,
      key: !!supabaseKey,
    }
  };

  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("ranking")
      .select("*")
      .limit(1);

    if (error) throw error;

    results.supabase_connection = "SUCCESS";
    results.database_data = data;
  } catch (err) {
    results.supabase_connection = "FAILED";
    results.error = err.message;
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
