import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mawewinuluacryowgbdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: allRes, error } = await supabase.from('processed_results').select('id, gpa_details');
  console.log('Result of fetching processed_results:', allRes?.length, error);
  if (allRes) {
    let updated = 0;
    for (let row of allRes) {
      if (row.gpa_details) {
         let changed = false;
         const mapToChange = {
            'Religion': 'Religion and Moral Education',
            'Religion and moral edu': 'Religion and Moral Education',
            'Religion & Ethics': 'Religion and Moral Education',
            'Social Studies': 'Bangladesh and Global Studies',
            'Bangladesh & World Studies': 'Bangladesh and Global Studies',
            'Social Science': 'Bangladesh and Global Studies',
            'Bangladesh and global studies': 'Bangladesh and Global Studies'
         };
         
         const newObjMap = {};
         for (let detail of row.gpa_details) {
             const newName = mapToChange[detail.subject];
             if (newName) {
                detail.subject = newName;
                changed = true;
                if (!newObjMap[newName] || newObjMap[newName].marks < detail.marks) {
                   newObjMap[newName] = detail;
                }
             } else {
                if (!newObjMap[detail.subject] || newObjMap[detail.subject].marks < detail.marks) {
                   newObjMap[detail.subject] = detail;
                }
             }
         }
         
         if (changed) {
            const finalArr = Object.values(newObjMap);
            const {error: upErr} = await supabase.from('processed_results').update({ gpa_details: finalArr }).eq('id', row.id);
            if(upErr) console.log('up err', upErr);
            else updated++;
         }
      }
    }
    console.log('Fixed processed results items:', updated);
  }
}
run();
