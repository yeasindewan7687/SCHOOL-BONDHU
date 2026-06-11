const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const zip = new JSZip();

function addDirectoryToZip(zipFolder, localPath) {
  const items = fs.readdirSync(localPath);
  for (const item of items) {
    const fullPath = path.join(localPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const folder = zipFolder.folder(item);
      addDirectoryToZip(folder, fullPath);
    } else {
      // Skip any pre-existing zip files to prevent recursive self-inclusion & giant file sizes
      if (item.endsWith('.zip')) {
        console.log(`➖ Excluding already compiled zip: ${item}`);
        continue;
      }
      const content = fs.readFileSync(fullPath);
      zipFolder.file(item, content);
    }
  }
}

async function createPackage() {
  console.log('Generating ZIP package for cPanel deployment...');
  
  // 1. Add dist directory recursively
  if (fs.existsSync('dist')) {
    const distFolder = zip.folder('dist');
    addDirectoryToZip(distFolder, 'dist');
    console.log('✔ Added dist/ directory to zip');
  } else {
    console.error('❌ Error: dist directory does not exist! Running npm run build first might be necessary.');
    process.exit(1);
  }

  // 2. Add app.js
  if (fs.existsSync('app.js')) {
    zip.file('app.js', fs.readFileSync('app.js'));
    console.log('✔ Added app.js to zip');
  } else {
    console.error('❌ Error: app.js does not exist.');
    process.exit(1);
  }

  // 3. Add minimalist, production-only package.json specifically for cPanel performance
  const minimalistPackageJson = {
    name: "childcare-high-school-backend",
    version: "1.0.0",
    private: true,
    description: "Production dependencies for Child Care High School backend on cPanel",
    main: "app.js",
    scripts: {
      "start": "node app.js"
    },
    dependencies: {
      "express": "^4.21.2",
      "dotenv": "^17.2.3",
      "@supabase/supabase-js": "^2.105.1",
      "@google/genai": "^1.29.0",
      "ws": "^8.21.0"
    },
    engines: {
      "node": ">=20.0.0"
    }
  };
  zip.file('package.json', JSON.stringify(minimalistPackageJson, null, 2));
  console.log('✔ Added optimized production package.json to zip (only 5 lightweight dependencies)');

  // 4. Skip package-lock.json to avoid cPanel over-allocating memory and parsing errors during npm install

  // 5. Add .env.example
  if (fs.existsSync('.env.example')) {
    zip.file('.env.example', fs.readFileSync('.env.example'));
    console.log('✔ Added .env.example to zip');
  }

  // 6. Add automatic Phusion Passenger restart trigger file
  const tmpFolder = zip.folder('tmp');
  tmpFolder.file('restart.txt', 'Restarting Passenger Node.js application...\nGenerated: ' + new Date().toISOString() + '\n');
  console.log('✔ Added tmp/restart.txt to zip (automatic Passenger restart trigger)');

  // Generate the ZIP
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  
  // Write to workspace root
  fs.writeFileSync('cpanel_deploy.zip', content);
  
  // Also write to dist/ folder for direct static serving (bypasses proxy and prevents 404 in hosting environments)
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  fs.writeFileSync(path.join('dist', 'cpanel_deploy.zip'), content);
  fs.writeFileSync(path.join('dist', 'cpanel-deploy.zip'), content);
  
  // Also write to public/ folder so Vite serves it statically in development inside the sandboxed iframe
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  fs.writeFileSync(path.join('public', 'cpanel_deploy.zip'), content);
  fs.writeFileSync(path.join('public', 'cpanel-deploy.zip'), content);
  
  console.log('\n⭐ SUCCESS: cpanel_deploy.zip generated successfully! size: ' + (content.length / 1024 / 1024).toFixed(2) + ' MB');
  console.log('You can download this file from your AI Studio File Explorer, upload it to your cPanel, extract it, and restart the Node app.\n');
}

createPackage().catch(err => {
  console.error('❌ Zip generation failed:', err);
  process.exit(1);
});
