const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getReposFromFile: () => ipcRenderer.invoke('renderer-init-done'),
  onShowAddModalRequested: (callback) => {
    // Deliberately strip event as it includes `sender` (note: Not sure about that, I partly pasted it from somewhere)
    // Note: The first argument is always event, but you can have as many arguments as you like, one is enough for me.
    ipcRenderer.on('show-add-modal', callback);
  },
  onShowEditModalRequested: (callback) => {
    ipcRenderer.on('show-edit-modal', callback)
  },

  onShowDeleteModalRequested: (callback) => {
    ipcRenderer.on('show-delete-modal', callback)
  },
  getRepo: (owner, name) => ipcRenderer.invoke("on-get-repo", owner, name),
  getRepoInfoFromGitHub: (owner, name) => ipcRenderer.invoke('on-add-repo', owner, name),
  getRepoReleasesFromGitHub: (owner, name) => ipcRenderer.invoke('on-get-releases-request', owner, name),
  saveReposToFile: (repos) => ipcRenderer.invoke("on-save-repos-to-file-request", repos),
  checkAssetDirExists: (owner, name, asset) => ipcRenderer.invoke("on-check-asset-exists-request", owner, name, asset),
  downloadAsset: (owner, name, asset) => ipcRenderer.invoke("on-download-asset-request", owner, name, asset),
  chooseExeFile: (owner, name) => ipcRenderer.invoke("on-choose-exe-request", owner, name),
  launchExeFile: (path) => ipcRenderer.invoke("on-launch-exe-request", path)


});


