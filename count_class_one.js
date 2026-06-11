import fs from 'fs';

const content = fs.readFileSync('full_database.csv', 'utf8');
const lines = content.split(/\r?\n/);
let headers = lines[0].split(',');
console.log("Headers:", headers);

let classOneCount = 0;
let students = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  const cols = line.split(',');
  // Check if any column is "One" exactly
  const isOne = cols.some(c => c.trim() === 'One');
  if (isOne) {
    classOneCount++;
    students.push(cols);
  }
}

console.log(`Found ${classOneCount} students in Class One.`);
if (classOneCount > 0) {
  console.log("First 3:", students.slice(0, 3));
}
