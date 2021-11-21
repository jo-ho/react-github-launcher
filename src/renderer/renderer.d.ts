export interface Api {
  getReposFromFile: () => Promise<Repo[]>,
  onShowAddModalRequested: (callback: () => void) => void,
  getRepoInfoFromGitHub: (owner: string, repo: string) => Promise<void>
}

declare global {
  interface Window {
    api: Api
  }

  interface Repo {
    name: string
    content: string
  }



}
