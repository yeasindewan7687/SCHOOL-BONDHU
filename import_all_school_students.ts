import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://mawewinuluacryowgbdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function formatValue(val: string): Promise<any> {
  const trimmed = val.trim();
  if (trimmed === 'NULL' || trimmed === 'null' || trimmed === '') return null;
  return trimmed.replace(/^'|'$/g, '').trim();
}

function parseSqlLine(line: string) {
  // Extract values inside VALUES (...)
  const match = line.match(/VALUES\s*\((.*)\);/i);
  if (!match) return null;
  
  const valuesStr = match[1];
  const values: string[] = [];
  let inString = false;
  let currentVal = '';
  let escape = false;

  for (let i = 0; i < valuesStr.length; i++) {
    const c = valuesStr[i];
    if (escape) {
      currentVal += c;
      escape = false;
    } else if (c === '\\') {
      escape = true;
    } else if (c === "'" && !inString) {
      inString = true;
    } else if (c === "'" && inString) {
      inString = false;
    } else if (c === ',' && !inString) {
      values.push(currentVal.trim());
      currentVal = '';
    } else {
      currentVal += c;
    }
  }
  values.push(currentVal.trim());
  return values;
}

async function main() {
  console.log("🚀 Starting Bulk Import of School Students & Routines...");

  // 1. Clean existing records in Admit Card tables to ensure clean reload
  console.log("Cleaning existing studentadmissions and studentsubprofiles data...");
  const { error: delSubErr } = await supabase.from('studentsubprofiles').delete().neq('id', 0);
  if (delSubErr) console.error("Error deleting studentsubprofiles:", delSubErr.message);

  const { error: delAdmErr } = await supabase.from('studentadmissions').delete().neq('id', 0);
  if (delAdmErr) console.error("Error deleting studentadmissions:", delAdmErr.message);

  const { error: delERErr } = await supabase.from('examroutines').delete().neq('id', 0);
  if (delERErr) console.error("Error deleting examroutines:", delERErr.message);

  // 2. Read and parse "import_students.sql"
  const sqlContent = fs.readFileSync('import_students.sql', 'utf-8');
  const lines = sqlContent.split('\n');

  const admissionsToInsert: any[] = [];
  const subprofilesToInsert: any[] = [];

  let subprofileIdCounter = 1;

  for (const line of lines) {
    if (!line.includes('INSERT INTO')) continue;
    
    const parsedValues = parseSqlLine(line);
    if (!parsedValues || parsedValues.length < 11) continue;

    // Mapping columns from import_students.sql:
    // 0: name (clean string)
    // 1: studentId (key string represented as integer like '727')
    // 2: class (Play, Nursery, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten)
    // 3: roll
    // 4: name_bn
    // 5: father_name
    // 6: mother_name
    // 7: dob
    // 8: study_group
    // 9: section
    // 10: photo_url

    const nameen = parsedValues[0].replace(/^'|'$/g, '').trim();
    const studentIdStr = parsedValues[1].replace(/^'|'$/g, '').trim();
    const studentClass = parsedValues[2].replace(/^'|'$/g, '').trim();
    const roll = parsedValues[3].replace(/^'|'$/g, '').trim();
    
    const namebn = parsedValues[4] === 'NULL' ? null : parsedValues[4].replace(/^'|'$/g, '').trim();
    const fathernameen = parsedValues[5] === 'NULL' ? null : parsedValues[5].replace(/^'|'$/g, '').trim();
    const mothernameen = parsedValues[6] === 'NULL' ? null : parsedValues[6].replace(/^'|'$/g, '').trim();
    const dob = parsedValues[7] === 'NULL' ? null : parsedValues[7].replace(/^'|'$/g, '').trim();
    
    let rawGroup = parsedValues[8] === 'NULL' ? null : parsedValues[8].replace(/^'|'$/g, '').trim();
    // Maps standard study_group index
    // Let's standardise the group code:
    // CCHS DB uses: '3' for Science, '2' for Commerce, '1' for Arts
    let groupCode: string | null = null;
    if (studentClass === 'Nine' || studentClass === 'Ten') {
      if (rawGroup && rawGroup.toLowerCase().includes('science')) {
        groupCode = '3';
      } else if (rawGroup && rawGroup.toLowerCase().includes('commerce')) {
        groupCode = '2';
      } else if (rawGroup && rawGroup.toLowerCase().includes('arts')) {
        groupCode = '1';
      } else {
        groupCode = '3'; // Default science for demo
      }
    }

    const section = parsedValues[9] === 'NULL' ? 'A' : parsedValues[9].replace(/^'|'$/g, '').trim();
    const studentimage = parsedValues[10] === 'NULL' ? null : parsedValues[10].replace(/^'|'$/g, '').trim();

    const numericalId = parseInt(studentIdStr);
    if (isNaN(numericalId)) {
      console.warn(`Skipping invalid ID row: ${studentIdStr}`);
      continue;
    }

    admissionsToInsert.push({
      id: numericalId,
      studentimage: studentimage,
      uniqueid: studentIdStr,
      session: 2026,
      class: studentClass,
      group: groupCode,
      section: section,
      shift: 'Day',
      nameen: nameen,
      namebn: namebn,
      dob: dob || null,
      fathernameen: fathernameen,
      mothernameen: mothernameen,
      bloodgroup: 'A positive (A+)',
      gender: 'Male',
      religion: 'Islam',
      studentnationality: 'BANGLADESHI',
      disabilities: 'NOT DISABILITIES',
      istribal: 'No',
      isorphan: 'No'
    });

    subprofilesToInsert.push({
      id: subprofileIdCounter++,
      sid: numericalId,
      session: 2026,
      class: studentClass,
      group: groupCode,
      section: section,
      shift: 'Day',
      roll: roll,
      active: 1
    });
  }

  console.log(`Parsed ${admissionsToInsert.length} students from import_students.sql!`);

  // Batch insert students into studentadmissions (chunks of 100 to prevent payload limits)
  const chunkSize = 100;
  for (let i = 0; i < admissionsToInsert.length; i += chunkSize) {
    const chunk = admissionsToInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('studentadmissions').insert(chunk);
    if (error) {
      console.error(`Error inserting studentadmissions chunk ${i}-${i + chunk.length}:`, error.message);
    } else {
      console.log(`Successfully inserted studentadmissions chunck: [${i} to ${Math.min(i + chunkSize, admissionsToInsert.length)}]`);
    }
  }

  // Batch insert studentsubprofiles
  for (let i = 0; i < subprofilesToInsert.length; i += chunkSize) {
    const chunk = subprofilesToInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('studentsubprofiles').insert(chunk);
    if (error) {
      console.error(`Error inserting studentsubprofiles chunk ${i}-${i + chunk.length}:`, error.message);
    } else {
      console.log(`Successfully inserted studentsubprofiles chunck: [${i} to ${Math.min(i + chunkSize, subprofilesToInsert.length)}]`);
    }
  }

  // 3. Let's seed Academic Subjects for all classes
  console.log("Seeding academic subjects...");
  const classesList = ['Play', 'Nursery', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  const subjectsSeed: any[] = [];
  let subjectIdCounter = 1000;

  for (const cls of classesList) {
    if (cls === 'Nine' || cls === 'Ten') {
      // Science subject templates
      const subjs = [
        { name: 'Bangla 1st Paper', code: '101' },
        { name: 'Bangla 2nd Paper', code: '102' },
        { name: 'English 1st Paper', code: '107' },
        { name: 'English 2nd Paper', code: '108' },
        { name: 'Mathematics', code: '109' },
        { name: 'Physics', code: '136' },
        { name: 'Chemistry', code: '137' },
        { name: 'Biology', code: '138' }
      ];
      for (const s of subjs) {
        subjectsSeed.push({
          id: subjectIdCounter++,
          classname: cls,
          groupname: 'Science',
          subjectname: s.name,
          subjectcode: s.code,
          academicyear: '2026'
        });
      }
    } else {
      // Junior / Primary subject templates
      const subjs = [
        { name: 'Bangla', code: '101' },
        { name: 'English', code: '102' },
        { name: 'Mathematics', code: '103' },
        { name: 'General Science', code: '104' },
        { name: 'Social Science', code: '105' },
        { name: 'Religion & Moral Edu.', code: '106' }
      ];
      for (const s of subjs) {
        subjectsSeed.push({
          id: subjectIdCounter++,
          classname: cls,
          groupname: 'N/A',
          subjectname: s.name,
          subjectcode: s.code,
          academicyear: '2026'
        });
      }
    }
  }

  // Wipe first to avoid duplicates
  const { error: delSubjErr } = await supabase.from('academicsubjects').delete().neq('id', 0);
  if (delSubjErr) console.error("Error wiping academicsubjects:", delSubjErr.message);

  const { error: subjInsErr } = await supabase.from('academicsubjects').insert(subjectsSeed);
  if (subjInsErr) {
    console.error("Error inserting academicsubjects seed:", subjInsErr.message);
  } else {
    console.log(`Seeded ${subjectsSeed.length} academicsubjects across all classes!`);
  }

  // 4. Seeding Exam Routines for ALL classes so that cards display schedules!
  console.log("Seeding exam routines with dates for ALL classes...");
  const routinesToInsert: any[] = [];
  let routineIdCounter = 1;

  // Let's create a dynamic list of exam dates
  const dates = ['2026-06-15', '2026-06-16', '2026-06-18', '2026-06-19', '2026-06-21', '2026-06-22'];

  for (const cls of classesList) {
    // Filter subjects for this class
    const classSubjects = subjectsSeed.filter(s => s.classname === cls);
    const termNames = ['1st Terminal Exam', 'Half Yearly Exam', 'Final Exam'];

    for (const term of termNames) {
      classSubjects.forEach((sub, index) => {
        const dateStr = dates[index % dates.length];
        routinesToInsert.push({
          id: routineIdCounter++,
          year: '2026',
          class: cls,
          group: sub.groupname === 'Science' ? '3' : 'all',
          section: 'all',
          shift: 'Day',
          term: term,
          subject: sub.id,
          date: dateStr,
          starttime: '01:00 PM',
          endtime: '04:00 PM'
        });
      });
    }
  }

  // Insert routines in chunks
  for (let i = 0; i < routinesToInsert.length; i += chunkSize) {
    const chunk = routinesToInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('examroutines').insert(chunk);
    if (error) {
      console.error(`Error inserting examroutines chunk ${i}-${i + chunk.length}:`, error.message);
    } else {
      console.log(`Inserted routines chunk: [${i} to ${Math.min(i + chunkSize, routinesToInsert.length)}]`);
    }
  }

  console.log("✨ Seed successfully finished! All tables populated with active records! ✨");
}

main();
