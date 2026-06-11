import { execSync } from 'child_process';
try {
  console.log(execSync('git status').toString());
  console.log(execSync('git checkout -- src/pages/Arcade.tsx').toString());
} catch (err) {
  console.error(err.message);
}
