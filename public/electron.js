const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const isDev = require('electron-is-dev');

let mainWindow;

/**
 * Professional Window Setup
 * Zenith File Manager ke liye optimized settings
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 650,
    show: false, // Splash screen feel ke liye pehle hide rakhenge
    title: "Zenith File Manager",
    // Icon path fix: __dirname use kiya hai taaki error na aaye
    icon: path.join(__dirname, '../assets/icon.ico'), 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // React ke saath easy communication ke liye
      enableRemoteModule: true
    },
    frame: true,
    backgroundColor: '#0f172a' // UI flicker prevent karne ke liye
  });

  // Development vs Production URL
  const startURL = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  // Jab content load ho jaye tabhi window dikhao (No white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      // mainWindow.webContents.openDevTools(); // Sirf debugging ke liye
    }
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

// --- ZENITH ENGINE: IPC HANDLERS ---

// 1. Folder Selection Permission (Windows Native Dialog)
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select Folder for Zenith Optimization',
    buttonLabel: 'Select Folder'
  });
  return result.filePaths[0];
});

// 2. Main Automation Logic: File Sorting Engine
ipcMain.handle('organize-folder', async (event, targetPath) => {
  try {
    const files = await fs.readdir(targetPath);
    
    // Microsoft Store standard categorization
    const categories = {
      'Zenith_Images': ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp'],
      'Zenith_Documents': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.csv', '.ppt', '.pptx', '.rtf'],
      'Zenith_Videos': ['.mp4', '.mkv', '.mov', '.avi', '.wmv', '.flv'],
      'Zenith_Archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
      'Zenith_Scripts': ['.py', '.js', '.html', '.css', '.json', '.cpp', '.java', '.cs'],
      'Zenith_Installers': ['.exe', '.msi', '.dmg', '.pkg']
    };

    let movedFilesCount = 0;

    for (const file of files) {
      const fullPath = path.join(targetPath, file);
      const stat = await fs.stat(fullPath);

      // Sirf files ko move karenge, pehle se bane folders ko nahi
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        
        for (const [folderName, exts] of Object.entries(categories)) {
          if (exts.includes(ext)) {
            const destinationDir = path.join(targetPath, folderName);
            
            // Folder nahi hai toh Zenith banayega
            await fs.ensureDir(destinationDir);
            
            // Move file securely
            const destPath = path.join(destinationDir, file);
            await fs.move(fullPath, destPath, { overwrite: false });
            movedFilesCount++;
            break;
          }
        }
      }
    }

    return { success: true, count: movedFilesCount };
  } catch (err) {
    console.error("Zenith Engine Error:", err);
    return { success: false, error: err.message };
  }
});

// 3. Post-Organization: Open Folder in Explorer
ipcMain.handle('open-explorer', async (event, folderPath) => {
  if (folderPath) {
    shell.openPath(folderPath);
  }
});

// --- App Lifecycle Management ---

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});