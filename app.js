/**
 * app.js
 * Startup entrypoint wrapper for cPanel Node.js app (Phusion Passenger)
 */
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'passenger-error.log');

function logError(title, err) {
  const errMsg = err ? `${err.message}\nStack:\n${err.stack}` : 'Unknown error';
  const logMsg = `[${new Date().toISOString()}] ${title}: ${errMsg}\n\n`;
  fs.writeFileSync(logFile, logMsg, { flag: 'a' });
}

// Write startup marker and log current directory contents to aid debugging
try {
  const dirContents = fs.readdirSync(__dirname);
  const contentsStr = dirContents.join(', ');
  fs.writeFileSync(logFile, `[${new Date().toISOString()}] ===== Node.js starting up via app.js =====\n`, { flag: 'a' });
  fs.writeFileSync(logFile, `[${new Date().toISOString()}] Current directory (${__dirname}) files: ${contentsStr}\n`, { flag: 'a' });
} catch (e) {
  console.error("Unable to write startup log:", e);
}

process.on('uncaughtException', (err) => {
  logError('Uncaught Exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  logError('Unhandled Rejection', err);
});

try {
  require('./dist/server.cjs');
  fs.writeFileSync(logFile, `[${new Date().toISOString()}] Require './dist/server.cjs' executed without immediate synchronous errors.\n`, { flag: 'a' });
} catch (err) {
  logError('Synchronous Startup Error', err);
  throw err;
}
