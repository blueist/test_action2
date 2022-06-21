const core = require('@actions/core');
const fs = require('fs')
const path = require('path');
const github = require('@actions/github');

//const targetProject = "ZF" 
const targetProject = "ZREQ"

const mMarker = '```'
const mDelimeter = '```'
const mPrefix = mMarker+'zinno-macro'+mDelimeter
const mPostfix = mMarker

var macros = {}



function test1(){
  const input = core.getInput('input')
  console.log(input)
  fs.readFile(input, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    
    //console.log(data);
    //var result = data.replace(/blueist/g, 'stillblueist');
    reStr = "("+mPrefix")[^("+mDelimeter+")]+("+mDelimeter+")"
    re = new RegExp(, 'g')
    mcrs = data.match(re)
    console.log(mcrs+ " " + mcrs.length)
    for(i =0;i<mcrs.length;i++){
      mcr = mcrs[i]
      mcrDef = /(::)[^(::)]+(::)/.exec(mcr)

      if(mcrDef == null || mcrDef.length < 1){
        continue
      }
      
      mcrSpec = mcrDef[0].replace(/::/g, '')
      console.log(mcrSpec)   
      console.log(mcrDef+ " " + mcr)      
      console.log(mcr.substring(mcrDef[0].length + 3 + 11, mcr.length-3))
    }
    
   
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
