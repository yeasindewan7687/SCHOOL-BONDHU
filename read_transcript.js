import fs from 'fs';
import readline from 'readline';

async function processLineByLine() {
  const fileStream = fs.createReadStream('/.gemini/antigravity/brain/df06a126-18eb-4b50-8ce8-02fde37a408e/.system_generated/logs/transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      // look at messages from the user
      if (data.role === 'user' || data.user) {
         console.log(JSON.stringify(data).substring(0, 500));
         if (JSON.stringify(data).includes('52 jon er id')) {
            console.log("FOUND:");
            console.log(data);
         }
      }
    } catch(e) {}
  }
}

processLineByLine();
