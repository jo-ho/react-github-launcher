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
import { Octokit } from '@octokit/core';
import extract from 'extract-zip';

import '../config'
import { execFile } from 'child_process';

const fetch = require('node-fetch')
const octokit = new Octokit()


export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('on-choose-exe-request', async (event) => {
  console.log(event)
 return dialog.showOpenDialog({ properties: ['openFile'] })
//  .then(result => {
//   console.log(result.canceled)
//   console.log(result.filePaths)
// }).catch(err => {
//   console.log(err)
// })


})

ipcMain.handle('renderer-init-done', async (event) => {
  console.log(event)
  const repos: Repo[]  = JSON.parse(fs.readFileSync( process.cwd() + '/repos.json', 'utf-8'))
  return repos
  // event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('on-get-repo', async (event, owner, repo) => {
  console.log(event)
  console.log(owner)
  console.log(repo)


  let res = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: owner,
    repo: repo,
  })

  console.log(res)
  return res.status == 200

})


ipcMain.handle('on-add-repo', async (event, owner, repo) => {
  console.log(event)
  console.log(owner)
  console.log(repo)

  let res = await octokit.request('GET /repos/{owner}/{repo}/readme', {
    owner: owner,
    repo: repo,
  })
  console.log(res.data.download_url)

// @ts-ignore
  const response = await fetch(res.data.download_url);

  // TODO error handling
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

  const body = await response.text();
  console.log(body)
  return body

})

ipcMain.handle('on-download-asset-request', async (event, asset) => {
  console.log(event)
  console.log(asset)

  const streamPipeline = util.promisify(stream.pipeline);


  const response = await fetch(asset.browser_download_url);

  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);


  await streamPipeline(response.body, fs.createWriteStream(globalThis.app.gamesFolderPath + asset.name));


  if (asset.content_type == "application/zip") {


  try {
		await extract(globalThis.app.gamesFolderPath + asset.name, { dir: path.join(process.cwd(), './games') })
		console.log('Extraction complete')


	  } catch (err) {
		// handle any errors
		console.log(err)
	  }
  }

} )

ipcMain.handle('on-get-releases-request', async (event, owner, repo) => {
  console.log(event)
	var res = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
		owner: owner,
		repo: repo
	  })


    console.log(res.data.assets)
    return res.data.assets
})


ipcMain.handle('on-save-repos-to-file-request', async (event, repos) => {
  console.log(event)
  console.log(repos)
  fs.writeFileSync( globalThis.app.repoJsonPath, JSON.stringify(repos, null, 2));

})

ipcMain.handle('on-launch-exe-request', async (event, path) => {

  console.log(event)
  console.log("launch", path)
  execFile(path)
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

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
