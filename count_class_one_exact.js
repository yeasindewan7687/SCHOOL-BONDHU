import fs from 'fs';

const content = fs.readFileSync('full_database.csv', 'utf8');
const lines = content.split(/\r?\n/);

let classOneCount = 0;
let header = lines[0];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  const cols = line.split(',');
  const studentClass = cols[5] ? cols[5].trim() : '';
  
  if (studentClass.toLowerCase() === 'one' || studentClass.toLowerCase() === 'class one') {
    classOneCount++;
  }
}

console.log(`The number of Class One students is: ${classOneCount}`);
