export interface Api {
  getReposFromFile: () => Promise<Repo[]>,
  getRepo: (owner: string, repo: string) => Promise<boolean>
  onShowAddModalRequested: (callback: (event: any, addAsRepo: boolean) => void) => void,
  onShowEditModalRequested: (callback: (event: any) => void) => void,
  getRepoInfoFromGitHub: (owner: string, repo: string) => Promise<string>,
  saveReposToFile: (repos: Repo[]) => Promise<void>
  getRepoReleasesFromGitHub: (owner: string, repo: string) => Promise<Array<any>>,
  downloadAsset: (asset: any) => Promise<void>,
  chooseExeFile: () =>  Promise<Electron.OpenDialogReturnValue>,
  launchExeFile: (path: string) => Promise<void>

}

declare global {
  interface Window {
    api: Api
  }

  interface Repo {
    owner: string,
    name: string,
    content: string,
    assets: Array<any>
    pathToExe: string
  }




}
