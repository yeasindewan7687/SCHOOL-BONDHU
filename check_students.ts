
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mawewinuluacryowgbdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const studentIds = ['896', '897', '898', '899'];

async function check() {
  for (const id of studentIds) {
    console.log(`\n=== Student ID: ${id} ===`);
    const { data: marks } = await supabase
      .from('student_marks')
      .select('subject, marks, class_name, exam_name, session')
      .eq('student_number', id);
    
    console.log('Marks:');
    marks?.forEach(m => {
       console.log(` - ${m.subject} (${m.marks}) [Class: ${m.class_name}, Exam: ${m.exam_name}, Session: ${m.session}]`);
    });

    const { data: res } = await supabase
      .from('processed_results')
      .select('*')
      .eq('student_number', id);
    
    console.log('Processed Results:');
    res?.forEach(r => {
        console.log(` - ${r.exam_name}: Total ${r.total_marks}, GPA ${r.gpa}, Grade ${r.grade}, Passed: ${r.is_passed}`);
    });
  }
}

check();
