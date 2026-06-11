import fs from 'fs';
import { supabase } from './src/lib/supabase.ts';

async function main() {
    const { data: students, error } = await supabase
        .from('students')
        .select('*');
        
    if (error) {
        console.error("Error fetching students:", error);
        return;
    }

    const classes = new Set(students.map(s => s.studentClass));
    console.log("Classes in DB:", Array.from(classes));
    const playStudents = students.filter(s => s.studentClass === 'Play');
    console.log(`There are ${playStudents.length} students in Play class in DB.`);
}

main().catch(console.error);
