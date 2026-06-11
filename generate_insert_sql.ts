import fs from 'fs';

const students = JSON.parse(fs.readFileSync('src/data/students_to_import.json', 'utf-8'));

let sql = `INSERT INTO public.students (name, "studentId", "studentClass", roll, name_bn, father_name, mother_name, dob, study_group, section, photo_url) VALUES\n`;

const values = students.map((s: any) => {
    const esc = (str: string) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';
    
    return `(${esc(s.name)}, ${esc(s.studentId)}, ${esc(s.studentClass)}, ${esc(s.roll)}, ${esc(s.name_bn)}, ${esc(s.father_name)}, ${esc(s.mother_name)}, ${esc(s.dob)}, ${esc(s.study_group)}, ${esc(s.section)}, ${esc(s.photo_url)})`;
});

sql += values.join(',\n') + ';';

fs.writeFileSync('insert_870_students.sql', sql);
console.log('Saved to insert_870_students.sql');
