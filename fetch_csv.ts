import fs from 'fs';

async function main() {
    const response = await fetch('https://docs.google.com/spreadsheets/d/1rAOq3PSyfnJeQNAnN3YQhGGq3duPPJ8r85QpFI37x-g/export?format=csv');
    const data = await response.text();
    fs.writeFileSync('full_database.csv', data);
    console.log(data.split('\n').slice(0, 5).join('\n'));
}

main();
