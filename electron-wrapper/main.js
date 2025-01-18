const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let icon = path.join(__dirname, 'logo.png');

let backendProcess;

function createWindow() {
  // Logo for the app
  
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

  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();

  // Kill the backend process when the Electron app is closed
  mainWindow.on('closed', () => {
    if (backendProcess) {
      backendProcess.kill();
    }
  });
}

app.whenReady().then(() => {
  // Start the backend JAR
  const jarPath = path.join(__dirname, '../backend/dist/backend-0.0.1-SNAPSHOT.jar');
  backendProcess = spawn('java', ['-jar', jarPath], { stdio: 'inherit' });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err);
  });

  backendProcess.on('exit', (code, signal) => {
    console.log(`Backend process exited with code ${code}, signal ${signal}`);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
