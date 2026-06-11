import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Try to select 1 row from exam_results
    let { data, error } = await supabase.from('exam_results').select('*').limit(1);
    if (error) {
        console.log("exam_results error:", error.message);
    } else {
        console.log("exam_results exists! columns:", data.length > 0 ? Object.keys(data[0]) : "empty");
    }

    let { data: d2, error: e2 } = await supabase.from('student_marks').select('*').limit(1);
    if (e2) {
        console.log("student_marks error:", e2.message);
    } else {
        console.log("student_marks exists! columns:", d2.length > 0 ? Object.keys(d2[0]) : "empty");
    }
}
main();
