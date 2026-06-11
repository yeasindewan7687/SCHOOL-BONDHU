import fs from 'fs';
import { supabase } from './src/lib/supabase.ts';

async function main() {
    const csvData = fs.readFileSync('play_students.csv', 'utf-8');
    const lines = csvData.split('\n');
    const validStudentIds = new Set<string>();

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        const studentId = parts[parts.length - 1]?.trim();
        if (studentId) {
            validStudentIds.add(studentId);
        }
    }

    console.log(`Found ${validStudentIds.size} valid student IDs in the CSV.`);

    // Fetch all students in 'Play' class from supabase
    const { data: playStudents, error } = await supabase
        .from('students')
        .select('*')
        .eq('studentClass', 'Class Play');

    if (error) {
        console.error("Error fetching students:", error);
        return;
    }

    console.log(`Found ${playStudents.length} students in Class Play class in DB.`);

    const studentsToDelete = playStudents.filter(s => !validStudentIds.has(s.studentId));
    console.log(`Deleting ${studentsToDelete.length} students...`);

    for (const s of studentsToDelete) {
        const { error } = await supabase.from('students').delete().eq('id', s.id);
        if (error) {
            console.error(`Failed to delete student ${s.studentId}:`, error);
        } else {
            console.log(`Deleted student ${s.studentId} (${s.name})`);
        }
    }
    
    // Also log matching students to keep
    const studentsToKeep = playStudents.filter(s => validStudentIds.has(s.studentId));
    console.log(`Keeping ${studentsToKeep.length} students.`);
}

main().catch(console.error);
