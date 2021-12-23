export interface Api {
  getReposFromFile: () => Promise<Repo[]>,
  getRepo: (owner: string, name: string) => Promise<boolean>
  onShowAddModalRequested: (callback: (event: any, addAsRepo: boolean) => void) => void,
  onShowEditModalRequested: (callback: (event: any) => void) => void,
  onShowDeleteModalRequested: (callback: (event: any) => void) => void,
  getRepoInfoFromGitHub: (owner: string, name: string) => Promise<string>,
  saveReposToFile: (repos: Repo[]) => Promise<void>
  getRepoReleasesFromGitHub: (owner: string, name: string) => Promise<Array<any>>,
  checkAssetDirExists: (owner: string, name : string, asset: any) => Promise<boolean>,
  downloadAsset: (owner: string, name : string, asset: any) => Promise<boolean>,
  chooseExeFile: (owner: string, name: string) =>  Promise<Electron.OpenDialogReturnValue>,
  launchExeFile: (path: string) => Promise<void>

}

declare global {
  interface Window {
    api: Api
  }



  interface Repo {
    id: string,
    owner: string,
    name: string,
    content: string,
    assets: Array<any>
    pathToExe: string
  }




}
