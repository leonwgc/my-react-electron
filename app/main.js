const { app, BrowserWindow } = require('electron');
const MenuBuilder = require('./menu');
const fs = require('fs');
const isDev = require('electron-is-dev');
// const log = require('electron-log');
const path = require('path');
const { ipcMain } = require('electron');

let mainWindow = null;

if (isDev || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('window-all-closed', () => {});

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1024,
    minHeight: 728,
    center: true,
    icon: 'app.ico',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:9000/');
  } else {
    mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'));
  }

  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
}

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

app.on('ready', createMainWindow);
