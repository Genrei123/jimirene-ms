const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let icon = path.join(__dirname, 'logo.png');
let backendProcess;

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    icon: icon,
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the built index.html
  mainWindow.loadFile(path.resolve(__dirname, '../frontend/dist/index.html'));

  // Handle window close events
  mainWindow.on('closed', () => {
    mainWindow = null; // Clean up the reference
  });
}

function startBackend() {
  // Get the path to the JAR file, accounting for both development and production
  const jarPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'backend-0.0.1-SNAPSHOT.jar')
    : path.join(__dirname, 'resources', 'backend', 'backend-0.0.1-SNAPSHOT.jar');

  console.log('Backend JAR Path:', jarPath);

  // Start the backend JAR process in hidden mode
  backendProcess = spawn('java', ['-jar', jarPath], {
    stdio: 'ignore', // Suppress stdout and stderr
    detached: true,  // Allow the process to run independently
  });

  // Ensure the backend process doesn't prevent the app from quitting
  backendProcess.unref();

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err.message);
  });

  backendProcess.on('exit', (code, signal) => {
    console.log(`Backend process exited with code ${code}, signal ${signal}`);
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill(); // Kill the backend process
    backendProcess = null; // Clean up the reference
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  stopBackend(); // Ensure backend is stopped when the app quits
});
