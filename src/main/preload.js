const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getReposFromFile: () => ipcRenderer.invoke('renderer-init-done', 'ping'),
  onShowAddModalRequested: (callback) => {
    // Deliberately strip event as it includes `sender` (note: Not sure about that, I partly pasted it from somewhere)
    // Note: The first argument is always event, but you can have as many arguments as you like, one is enough for me.
    ipcRenderer.on('show-add-modal', callback);
  },
  getRepoInfoFromGitHub: (owner, repo) => ipcRenderer.invoke('on-add-repo', owner, repo),
  saveReposToFile: (repos) => ipcRenderer.invoke("on-save-repos-to-file-request", repos)

});


