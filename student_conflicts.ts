import { supabase } from './src/lib/supabase.ts';
import playStudents from './src/play_students.json';

async function main() {
    const { data: students, error } = await supabase
        .from('students')
        .select('studentId');
        
    if (error) {
        console.error("Error fetching students:", error);
        return;
    }

    const set = new Set(students.map(s => s.studentId));
    let conflict = false;
    for (const ps of playStudents) {
        if (set.has(ps.studentId)) {
            console.log("Conflict with studentId:", ps.studentId);
            conflict = true;
        }
    }
    if (!conflict) console.log("No studentId conflicts");
}
main();
