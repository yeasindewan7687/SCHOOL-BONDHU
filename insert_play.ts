import fs from 'fs';
import { supabase } from './src/lib/supabase.ts';

async function main() {
    const csvData = fs.readFileSync('play_students.csv', 'utf-8');
    const lines = csvData.split('\n');

    const inserts = [];

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        // SL,Student Name,Class,Class Roll,Group,Section,Student ID
        // 1,SRIJON PAL,Play,24,N/A,Shimul,727
        const name = parts[1]?.trim();
        const studentClass = parts[2]?.trim() === 'Play' ? 'Class Play' : parts[2]?.trim();
        const roll = parts[3]?.trim();
        let studyGroup = parts[4]?.trim();
        if (studyGroup === 'N/A') studyGroup = '';
        const section = parts[5]?.trim();
        const studentId = parts[6]?.trim();

        if (studentId && name) {
            inserts.push({
                name,
                studentId,
                password: 'password123', // Default
                studentClass: studentClass || 'Class Play',
                roll,
                study_group: studyGroup,
                section
            });
        }
    }

    console.log(`Inserting ${inserts.length} students into Class Play...`);

    for (const s of inserts) {
        const { error } = await supabase.from('students').insert([s]);
        if (error) {
           console.error(`Failed to insert ${s.name}:`, error.message);
        } else {
           console.log(`Inserted ${s.name} (${s.studentId})`);
        }
    }
}

main().catch(console.error);
