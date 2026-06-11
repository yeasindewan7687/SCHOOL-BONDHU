import { supabase } from './src/lib/supabase';

async function main() {
    console.log("Deleting results...");
    const { error: e3 } = await supabase.from('results').delete().neq('student_name', 'impossible_value');
    if (e3) console.error("Err e3:", e3);

    console.log("Deletion complete.");
}

main();
