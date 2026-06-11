import fs from 'fs';
const content = fs.readFileSync('drive_f1.sql', 'utf-8');
const items = content.match(/INSERT INTO `studentadmissions`.*?VALUES\s*\(([\s\S]*?)\);/gi);
if (items) {
  const firstInsert = items[0];
  const tuple = firstInsert.substring(firstInsert.indexOf('(') + 1, firstInsert.indexOf(')'));
  console.log(tuple);
}