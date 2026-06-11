import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf-8');
const start_str = "{activeResTab === 'links' && (";
const end_str = "function AdmissionsAdmin() {";

const start_idx = content.indexOf(start_str);
const end_idx = content.indexOf(end_str);

if (start_idx !== -1 && end_idx !== -1) {
    let new_content = content.substring(0, start_idx) + "    </div>\n  );\n}\n\n" + content.substring(end_idx);
    fs.writeFileSync('src/pages/AdminPanel.tsx', new_content, 'utf-8');
    console.log("Successfully removed chunk");
} else {
    console.log("Could not find", start_idx, end_idx);
}
