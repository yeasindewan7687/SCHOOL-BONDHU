import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Deleting processed_results...");
    const { error: e1 } = await supabase.from('processed_results').delete().neq('student_number', 'impossible_value');
    if (e1) console.error("Err:", e1);
    
    console.log("Deleting student_marks...");
    const { error: e2 } = await supabase.from('student_marks').delete().neq('student_number', 'impossible_value');
    if (e2) console.error("Err:", e2);
    
    console.log("Deleting results (old external results)...");
    const { error: e3 } = await supabase.from('results').delete().neq('student_id', 'impossible_value');
    if (e3) console.error("Err:", e3);

    console.log("Deletion complete.");
}

main();
