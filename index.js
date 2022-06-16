const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const github = require('@actions/github');

//const targetProject = "ZF" 
const targetProject = "ZREQ"

function test1(){
  const context = github.context;
  console.log("context "+JSON.stringify(context))

}

test1()
