import fs from 'fs';

const p = 'src/lib/resultLogic.ts';
let content = fs.readFileSync(p, 'utf-8');
content = content.replace(/Religion and moral edu/g, "Religion and Moral Education");
content = content.replace(/Bangladesh and global studies/g, "Bangladesh and Global Studies");
fs.writeFileSync(p, content);

console.log("Updated resultLogic.ts");
