/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
import util from 'util'
import stream from 'stream'
import extract from 'extract-zip';

import '../config'
import { execFile } from 'child_process';
import GithubService from './services/github_service';
import fileType from 'file-type';
const githubService = new GithubService();


export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
};

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('on-choose-exe-request', async (_event, owner, name) => {
  if (owner && name) {
    return dialog.showOpenDialog({ properties: ['openFile'], defaultPath: path.join(process.cwd(), globalThis.app.gamesFolderPath, owner, name)})
  } else return  dialog.showOpenDialog({ properties: ['openFile']})

});

ipcMain.handle('renderer-init-done', async (_event) => {
  const repos: Repo[]  = JSON.parse(fs.readFileSync( path.join(process.cwd(), globalThis.app.repoJsonPath), 'utf-8'))
  return repos
});

ipcMain.handle('on-get-repo', async (_event, owner, name) => {
  return await githubService.repoExists(owner, name)
});


ipcMain.handle('on-add-repo', async (_event, owner, name) => {


  return await githubService.getRepoReadme(owner, name)

});

ipcMain.handle('on-check-asset-exists-request', async (_event, owner, name, asset) => {







  const assetDir = path.join(process.cwd(), globalThis.app.gamesFolderPath, owner, name, path.parse(asset.name).name)
  if (!fs.existsSync(assetDir)){
    return false
  } else return true

});

ipcMain.handle('on-download-asset-request', async (_event, owner, name, asset) => {

  const streamPipeline = util.promisify(stream.pipeline);

  const response = await githubService.getAsset(asset.browser_download_url)

  if (response) {
    const assetDir = path.join(process.cwd(), globalThis.app.gamesFolderPath, owner, name, path.parse(asset.name).name)

    if (!fs.existsSync(assetDir)){
      fs.mkdirSync(assetDir, { recursive: true });
    }

    const assetFile = path.join(assetDir, asset.name)

    await streamPipeline(response.body, fs.createWriteStream(assetFile));

    const assetFileType = await fileType.fromFile(assetFile)

    if (assetFileType?.mime == "application/zip" ) {


    try {
      await extract(assetFile, { dir: assetDir })
      } catch (err) {
        return false
      }
    }

  }
  return true

} );

ipcMain.handle('on-get-releases-request', async (_event, owner, name) => {

  return await githubService.getRepoReleases(owner, name)
});


ipcMain.handle('on-save-repos-to-file-request', async (_event, repos) => {



  fs.writeFileSync( path.join(process.cwd(), globalThis.app.repoJsonPath), JSON.stringify(repos, null, 2));

});

ipcMain.handle('on-launch-exe-request', async (_event, path) => {
  execFile(path)
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
};

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
};

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
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
    x: 200,
    y: 200,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));


  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.maximize();

      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

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
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
