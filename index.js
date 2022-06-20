const core = require('@actions/core');
const fs = require('fs')
const path = require('path');
const github = require('@actions/github');

//const targetProject = "ZF" 
const targetProject = "ZREQ"




function test1(){
  const input = core.getInput('input')
  console.log(input)
  fs.readFile(input, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    //console.log(data);
    //var result = data.replace(/blueist/g, 'stillblueist');
    t = data.match(/(```zinno-macro::)[^(```)]+(```)/g)
    console.log(t)
    fs.writeFile(input, data, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });
core.setOutput("changed", 'true');
//   const context = github.context;
//   console.log("context "+JSON.stringify(context))

//   const payload = github.context.payload;
//   const ref     = payload.ref;
//   if (!payload.repository) {
//       throw new Error();
//   }
//   const owner   = payload.repository.owner.login;
//   const repo    = payload.repository.name;
}

// const input = core.getInput('input')
// console.log(input)
test1()
