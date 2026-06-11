import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mawewinuluacryowgbdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Renaming subject DB records...");
  
  const subjectsToRename = ['Religion', 'Religion and moral edu', 'Religion & Ethics'];
  
  for (const sub of subjectsToRename) {
     const {data: recs} = await supabase.from('student_marks').select('id').eq('subject', sub);
     if (recs && recs.length > 0) {
        await supabase.from('student_marks').update({ subject: 'Religion and Moral Education' }).eq('subject', sub);
        console.log(`Renamed ${recs.length} records form ${sub}`);
     }
  }

  const subjectsToRename2 = ['Social Studies', 'Bangladesh & World Studies', 'Social Science', 'Bangladesh and global studies'];
  for (const sub of subjectsToRename2) {
     const {data: recs} = await supabase.from('student_marks').select('id').eq('subject', sub);
     if (recs && recs.length > 0) {
        await supabase.from('student_marks').update({ subject: 'Bangladesh and Global Studies' }).eq('subject', sub);
        console.log(`Renamed ${recs.length} records form ${sub}`);
     }
  }

  // Deduplicate marks
  const { data: allMarks } = await supabase.from('student_marks').select('*').in('subject', ['Religion and Moral Education', 'Bangladesh and Global Studies']);
  
  if (allMarks) {
      // Group by student_id + exam_term_id + subject + session + class_name
      const grouped = {};
      for (const m of allMarks) {
          const key = `${m.student_number}_${m.exam_term_id}_${m.exam_name}_${m.subject}_${m.session}_${m.class_name}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(m);
      }

      for (const key in grouped) {
          if (grouped[key].length > 1) {
              const duplicates = grouped[key];
              duplicates.sort((a, b) => b.marks - a.marks); // Keep highest mark
              
              const toDelete = duplicates.slice(1);
              for (const del of toDelete) {
                  await supabase.from('student_marks').delete().eq('id', del.id);
                  console.log(`Deleted duplicate ${del.subject} for ${del.student_name}`);
              }
          }
      }
  }
}
run();
