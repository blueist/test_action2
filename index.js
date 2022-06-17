const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const github = require('@actions/github');

//const targetProject = "ZF" 
const targetProject = "ZREQ"




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
}

const input = core.getInput('input')
console.log(input)
//test1()
