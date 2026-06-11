import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mawewinuluacryowgbdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Adding notice...");
  const { data, error } = await supabase.from('notices').insert([{
    title: "Test Notice",
    details: "Test Details",
    link: "test.com",
    date: "1 May 2026"
  }]);
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success:", data);
  }

  const { data: fetch, error: fetchErr } = await supabase.from('notices').select('*');
  console.log("Fetched notices:", fetch, fetchErr);
}

run();
