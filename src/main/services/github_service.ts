import { Octokit } from '@octokit/core';
// @ts-ignore
import fetch from 'node-fetch';


const octokit = new Octokit()


export default class GithubService {
  repoExists = async (owner: string, repo: string) : Promise<boolean>  => {
    let res = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: owner,
      repo: repo,
    })


    return res.status == 200
  }

  getRepoReadme = async (owner: string, repo: string) : Promise<string>  => {


    let res = await octokit.request('GET /repos/{owner}/{repo}/readme', {
      owner: owner,
      repo: repo,
    })


    if (res.status != 200) return ""


  // @ts-ignore
    const response = await fetch(res.data.download_url);

    // TODO error handling
    if (!response.ok) return ""

    const body = await response.text();

    return body
  }

  getAsset = async (downloadUrl: string) : Promise<any> => {

    const response = await fetch(downloadUrl);

    if (!response.ok) return null;
    return response
  }

  getRepoReleases = async ( owner: string, repo: string) : Promise<any[]> => {
    var res = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner: owner,
      repo: repo
      })
      if (res.status != 200) return []



      return res.data.assets
  }
}
