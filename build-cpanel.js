import { execSync } from 'child_process';

console.log('Starting build process on cPanel...');
try {
  // Execute the production build command
  const output = execSync('npm run build', { encoding: 'utf-8' });
  console.log('Build succeeded!');
  console.log(output);
} catch (error) {
  console.error('Build failed:');
  console.error(error.message);
  if (error.stdout) console.log('Stdout:', error.stdout);
  if (error.stderr) console.error('Stderr:', error.stderr);
}
