export interface Api {
  getReposFromFile: () => Promise<Repo[]>,
  onShowAddModalRequested: (callback: () => void) => void,
  getRepoInfoFromGitHub: (owner: string, repo: string) => Promise<string>,
  saveReposToFile: (repos: Repo[]) => Promise<void>
}

declare global {
  interface Window {
    api: Api
  }

  interface Repo {
    owner: string,
    name: string,
    content: string
  }



}
