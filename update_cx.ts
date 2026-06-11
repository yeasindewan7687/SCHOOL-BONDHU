import fs from 'fs';
let code = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');
code = code.replace(
  /const cx = \['Six', 'Seven', 'Eight', 'Nine', 'Ten'\]\.includes\(marksClass\);/g,
  "const cx = ['Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Ex Ten'].includes(marksClass);"
);
fs.writeFileSync('src/pages/AdminPanel.tsx', code);
