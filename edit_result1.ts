import fs from 'fs';

let content = fs.readFileSync('src/pages/Result.tsx', 'utf-8');

const target1 = `            const internalData: any = {
               "Student Name": match.student_name,
               "GPA": match.gpa,
               "Position": match.rank_roll,
               "Total Marks": match.total_marks,
               "Grade": match.grade,
               "isInternal": true
            };
            setCurrentExamName(match.exam_name);`;

const replace1 = `            const { data: studentRecords } = await supabase
                .from('students')
                .select('*')
                .ilike('studentId', \`%\${studentId.trim()}%\`);
             const stuProfile = studentRecords && studentRecords.length > 0 ? studentRecords[0] : {};

             let previousTerminals: any[] = [];
             if (targetExam === 'Final Terminal Exam') {
                 const { data: prevRes } = await supabase.from('processed_results')
                   .select('*')
                   .eq('class_name', targetClass)
                   .ilike('student_number', \`%\${studentId.trim()}%\`)
                   .in('exam_name', ['1st Terminal Exam', '2nd Terminal Exam']);
                 if (prevRes) previousTerminals = prevRes;
             }

             const internalData: any = {
                "Student Name": match.student_name,
                "GPA": match.gpa,
                "Position": match.rank_roll,
                "Total Marks": match.total_marks,
                "Grade": match.grade,
                "isInternal": true,
                "studentDetails": stuProfile,
                "previousTerminals": previousTerminals
             };
             setCurrentExamName(match.exam_name);`;

content = content.replace(target1, replace1);

fs.writeFileSync('src/pages/Result.tsx', content, 'utf-8');
console.log("Updated result data structure.");
