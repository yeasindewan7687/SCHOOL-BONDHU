import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("student_marks")
    .select("*")
    .eq("student_number", 293)
    .eq("session", "2026");

  console.log("Marks for 293:", data, error);
}
run();
