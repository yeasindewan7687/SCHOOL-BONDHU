import { supabase } from './src/lib/supabase';

async function main() {
    console.log("Deleting processed_results...");
    const { error: e1 } = await supabase.from('processed_results').delete().neq('student_number', 'impossible_value');
    if (e1) console.error("Err e1:", e1);
    
    console.log("Deleting student_marks...");
    const { error: e2 } = await supabase.from('student_marks').delete().neq('student_number', 'impossible_value');
    if (e2) console.error("Err e2:", e2);
    
    console.log("Deleting results...");
    const { error: e3 } = await supabase.from('results').delete().neq('id', '0faec342'); // delete all basically
    if (e3) console.error("Err e3:", e3);

    console.log("Deletion complete.");
}

main();
