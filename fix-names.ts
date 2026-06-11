import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mawewinuluacryowgbdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  await supabase.from('student_marks').update({ subject: 'Religion and moral edu' }).eq('subject', 'Religion');
  await supabase.from('student_marks').update({ subject: 'Religion and moral edu' }).eq('subject', 'Religion & Ethics');
  await supabase.from('student_marks').update({ subject: 'Bangladesh and global studies' }).eq('subject', 'Social Studies');
  await supabase.from('student_marks').update({ subject: 'Bangladesh and global studies' }).eq('subject', 'Bangladesh & World Studies');
  await supabase.from('student_marks').update({ subject: 'Bangladesh and global studies' }).eq('subject', 'Social Science');

  console.log("Subject names updated in DB.");
}
run();
