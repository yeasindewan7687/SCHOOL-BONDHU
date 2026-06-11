import fs from 'fs';

const content = fs.readFileSync('drive_f1.sql', 'utf-8');

function parseTuples(str: string) {
  let inString = false;
  let escape = false;
  let currentTuple = [];
  let currentVal = '';
  let tuples = [];
  
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (escape) {
      if (c === 'n') currentVal += '\n';
      else if (c === 'r') currentVal += '\r';
      else if (c === 't') currentVal += '\t';
      else currentVal += c;
      escape = false;
    } else if (c === '\\') {
      escape = true;
    } else if (c === "'" && !inString) {
      inString = true;
    } else if (c === "'" && inString) {
      inString = false;
    } else if (c === ',' && !inString) {
      currentTuple.push(currentVal.trim());
      currentVal = '';
    } else if (c === '(' && !inString && currentTuple.length === 0) {
    } else if (c === ')' && !inString) {
      currentTuple.push(currentVal.trim());
      currentVal = '';
      tuples.push(currentTuple);
      currentTuple = [];
      while(str[i+1] === ',' || str[i+1] === ' ' || str[i+1] === '\n' || str[i+1] === '\r') i++;
      if (str[i+1] === ';') break; 
    } else {
      currentVal += c;
    }
  }
  return tuples;
}

const inserts = content.match(/INSERT INTO `studentadmissions`[^]*?VALUES\s*([\s\S]*?);/g);
if (inserts) {
  let mappedStudents = [];
  for (const insert of inserts) {
     const valStrMatch = insert.match(/VALUES\s*([\s\S]*?);/);
     if (valStrMatch) {
         let tuples = parseTuples(valStrMatch[1]);
         for (let tup of tuples) {
             if (tup.length < 50) continue;
             let sClass = tup[4].replace(/class\s*/i, '').trim();
             const photoString = tup[1];
             const photoUrl = photoString && photoString !== "''" && photoString !== 'NULL' 
                            ? `https://mahilaraacademy.edu.bd/uploads/studentimage/${photoString}` 
                            : null;
             
             mappedStudents.push({
                 name: tup[11] === 'NULL' ? '' : tup[11],
                 studentId: tup[2] === 'NULL' ? '' : tup[2],
                 password: '', 
                 studentClass: sClass === 'NULL' ? '' : `Class ${sClass}`,
                 roll: '00',
                 name_bn: tup[12] === 'NULL' ? '' : tup[12],
                 father_name: tup[35] === 'NULL' ? '' : tup[35],
                 mother_name: tup[43] === 'NULL' ? '' : tup[43],
                 dob: tup[13] === 'NULL' ? '' : tup[13],
                 study_group: tup[5] === 'NULL' ? '' : tup[5],
                 section: tup[6] === 'NULL' ? '' : tup[6],
                 photo_url: photoUrl
             });
         }
     }
  }
  
  let toInsert = mappedStudents.map(s => {
      let ret: any = {};
      for (const key in s) {
          if (typeof s[key as keyof typeof s] === 'string') {
              let val = (s[key as keyof typeof s] as string).replace(/^'|'$/g, '');
              if (key === 'studentClass') {
                  val = val.replace(/Class Class/g, 'Class');
              }
              if (key === 'studentId' && val === '') {
                   val = `SID-${Math.floor(Math.random() * 1000000)}`;
              }
              ret[key] = val;
          } else {
              ret[key] = s[key as keyof typeof s];
          }
      }
      return ret;
  });

  if (!fs.existsSync('src/data')) {
      fs.mkdirSync('src/data');
  }
  fs.writeFileSync('src/data/students_to_import.json', JSON.stringify(toInsert, null, 2));
  console.log(`Saved ${toInsert.length} students to src/data/students_to_import.json`);
} else {
  console.log('No inserts found.');
}
