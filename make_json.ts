import fs from 'fs';

const csvData = fs.readFileSync('play_students.csv', 'utf-8');
const lines = csvData.split('\n');
const inserts = [];

for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    
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
            studentId: `SID-${studentId}`, // Adding SID- prefix since AdminPanel adds it? Actually the user said "student id as in the sheet". The sheet has 727.
            password: 'password123',
            studentClass: studentClass || 'Class Play',
            roll,
            study_group: studyGroup,
            section,
            photo_url: "",
            name_bn: "",
            father_name: "",
            mother_name: "",
            dob: ""
        });
    }
}

// Ensure strict adherence to the exact student IDs without prefixes
inserts.forEach(s => s.studentId = s.studentId.replace('SID-SID-', 'SID-').replace('SID-', ''));

fs.writeFileSync('src/play_students.json', JSON.stringify(inserts, null, 2));
console.log('JSON saved to src/play_students.json');
