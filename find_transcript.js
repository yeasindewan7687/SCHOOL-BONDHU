import fs from 'fs';
import path from 'path';

function findTranscript(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file === 'logs') {
        const tPath = path.join(fullPath, 'transcript.jsonl');
        if (fs.existsSync(tPath)) return tPath;
      } else {
        const found = findTranscript(fullPath);
        if (found) return found;
      }
    }
  }
  return null;
}

const tPath = findTranscript('/.gemini');
if (tPath) {
  console.log("Found:", tPath);
  const content = fs.readFileSync(tPath, 'utf8');
  let count = 0;
  for (const line of content.split('\n')) {
     if (line.includes('52 jon er id') || line.includes('class 1 er id')) {
        console.log("MATCH:", line.substring(0, 1000));
        count++;
     }
  }
  
  // also let's just print the last 5 user messages
  const userMessages = [];
  for (const line of content.split('\n')) {
    try {
      const data = JSON.parse(line);
      if (data.role === 'user' || data.user) userMessages.push(data);
    } catch(e) {}
  }
  console.log("Last 2 user msgs:");
  console.log(JSON.stringify(userMessages.slice(-2), null, 2));

} else {
  console.log("Not found in /.gemini");
}
