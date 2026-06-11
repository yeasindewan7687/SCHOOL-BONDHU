import { supabase } from './src/lib/supabase';

async function main() {
    let { data, error } = await supabase.from('exam_results').select('*').limit(1);
    if (error) {
        console.log("exam_results error:", error.message);
    } else {
        console.log("exam_results exists:", data.length > 0 ? Object.keys(data[0]) : "empty");
    }

    let { data: d2, error: e2 } = await supabase.from('student_marks').select('*').limit(1);
    if (e2) {
        console.log("student_marks error:", e2.message);
    } else {
        console.log("student_marks exists:", d2.length > 0 ? Object.keys(d2[0]) : "empty");
    }
}
main();
