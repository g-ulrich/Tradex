/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {TSAuthentication} from './tradestation/authentication';
const sound = require("sound-play");

const tsAuth = new TSAuthentication();

setupTitlebar();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let loginWindow: BrowserWindow | null = null;


ipcMain.on('playDing', async (event, _) => {
  try {
    const filePath = path.join(__dirname, "sounds/ding.wav");
    await sound.play(filePath);
  } catch (error) {
    console.error(`Play ding - ${error}`);
  }
});


ipcMain.on('getRefreshToken', async (event, _) => {
    const tokenObj = await tsAuth.triggerRefresh();
    event.reply('sendRefreshToken', {ts: tokenObj, alpha: process.env.ALPHA_VANTAGE_API_1});
});


ipcMain.on('getNewAccessToken', async (event, _) => {
  const tokenObj = await tsAuth.getNewAccessToken();
  event.reply('sendNewAccessToken', {ts: tokenObj});
});


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    backgroundColor: '#36393E',
    //frame: false, // needed if process.versions.electron < 14
    titleBarStyle: 'hidden',
    /* You can use *titleBarOverlay: true* to use the original Windows controls */
    titleBarOverlay: true,
    // frame: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },

  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  attachTitlebarToWindow(mainWindow);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const createLoginWindow = async (event: any) => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  loginWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 800,
    icon: getAssetPath('icon.png'),
    backgroundColor: '#36393E',
  });
  loginWindow.loadURL(tsAuth.getAuthUrl());

  loginWindow.on('ready-to-show', () => {
    if (!loginWindow) {
      throw new Error('"loginWindow" is not defined');
    }else{
      loginWindow.show();
    }
  });

  loginWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  loginWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  loginWindow.webContents.on('will-redirect', (callback) => {
    if (callback.url.includes(tsAuth.callBackUrl)) {
        tsAuth.getAuthCode(callback.url);
        event.reply('open-login-window', {url: callback.url, success: true});
        if (loginWindow) {
          loginWindow.close();
        }
    }
  });
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    ipcMain.on('open-login-window', (event, _) => {
      createLoginWindow(event);
    });
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();

    });
  })
  .catch(console.log);

