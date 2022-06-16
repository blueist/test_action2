const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const github = require('@actions/github');

//const targetProject = "ZF" 
const targetProject = "ZREQ"

async function getCommitsFromPayload(octokit, payload) {
    const commits = payload.commits;
    const owner   = payload.repository.owner.login;
    const repo    = payload.repository.name;

    const res = await Promise.all(commits.map(commit => octokit.repos.getCommit({
        owner, repo, ref: commit.id
    })));
    return res.map(res => res.data);
}

function updatedFiles(commits) {
    data = []
    for (c in commits) {
        for(f in c.files) {
            if(f.status !== 'removed'){
                data.push(f.filename)
            }
        }
    }
    return data
}

const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

function test1(){
  const context = github.context;
  console.log("context "+JSON.stringify(context))

  const payload = github.context.payload;
  const ref     = payload.ref;
  if (!payload.repository) {
      throw new Error();
  }
  const owner   = payload.repository.owner.login;
  const repo    = payload.repository.name;

  const commits = await getCommitsFromPayload(octokit, payload);
  const files = updatedFiles(commits);  
  
  console.log(files)
}


test1()
