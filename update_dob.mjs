import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://mawewinuluacryowgbdu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M');

async function test() {
  const { data, error } = await supabase.from('students').select('*').limit(5);
  console.log(data);
}
test();
