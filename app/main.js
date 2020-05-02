const { app, BrowserWindow } = require('electron');
const MenuBuilder = require('./menu');
const fs = require('fs');
const isDev = require('electron-is-dev');
// const { autoUpdater } =require( "electron-updater");
const log = require('electron-log');
const path = require('path');
const { ipcMain } = require('electron');

// let doc = yaml.load(fs.readFileSync(`${__dirname}/baasConfig.yaml`, "utf8"));
let mainWindow = null;

if (isDev || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

// class AppUpdater {
//   constructor(mainWindow) {
//     log.transports.file.level = "info";
//     autoUpdater.logger = log;
//     autoUpdater.autoDownload = false;
//     autoUpdater.setFeedURL(doc.client_publish_url);
//     this.win = mainWindow;
//   }
//   checkupdate() {
//     ipcMain.on("downloadUpdate", () => {
//       autoUpdater.downloadUpdate();
//     });
//     autoUpdater.on("update-available", () => {
//       this.win.webContents.send("update-available");
//     });
//     autoUpdater.on("update-not-available", () => {
//       this.win.webContents.send("update-not-available");
//     });
//     ipcMain.on("install-now", () => {
//       autoUpdater.quitAndInstall();
//     });
//     autoUpdater.on("download-progress", e => {
//       this.win.webContents.send("download-progress", e.percent);
//     });
//     autoUpdater.on("update-downloaded", () => {
//       this.win.webContents.send("update-downloaded");
//       setTimeout(() => {
//         autoUpdater.quitAndInstall();
//       }, 1500);
//     });
//     autoUpdater.checkForUpdates();
//   }
// }

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  logger('客户端关闭');
  if (process.platform !== 'darwin') {
    //let goApi=new goService();
    //goApi.common_exit();
    app.quit();
  }
});

app.on('window-all-closed', () => {

});

async function createMainWindow() {
  logger('客户端启动');

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1024,
    minHeight: 728,
    center: true,
    // icon: 'resources/app/app.ico',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:9000/');
  } else {
    mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'));
  }

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    logger('web加载成功');
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // ipcMain.on("get-baas-config", e => {
  //   e.sender.send("got-baas-config", doc);
  // });

  // ipcMain.on("checkupdate", () => {
  //   const updater = new AppUpdater(mainWindow);
  //   updater.checkupdate();
  // });
}

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

app.on('ready', createMainWindow);
