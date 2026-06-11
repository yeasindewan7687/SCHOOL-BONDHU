const { execSync } = require('child_process');
const fs = require('fs');

let log = '';
function run(cmd) {
  log += 'Executing: ' + cmd + '\n';
  try {
    const out = execSync(cmd).toString();
    log += 'Output:\n' + out + '\n';
  } catch (err) {
    log += 'Error: ' + err.message + '\nStderr: ' + (err.stderr ? err.stderr.toString() : '') + '\n';
  }
}

run('git status');
run('git checkout -- src/pages/Arcade.tsx');
run('git status');

fs.writeFileSync('/git-log.txt', log);
console.log('Done!');
