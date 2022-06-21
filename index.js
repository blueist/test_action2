const core = require('@actions/core');
const fs = require('fs')
const path = require('path');
const github = require('@actions/github');

//const targetProject = "ZF" 
const targetProject = "ZREQ"

const mMarker = '```'
const mSpliter = '::'
const mPrefix = mMarker+'zinno-macro'+mSpliter
const mPostfix = mMarker

const mcCallPrefix = mSpliter+'zinno-macro'+mSpliter
const mcCallPostfix = mSpliter

var macros = {}



function test1(){
  const input = core.getInput('input')
  console.log(input)
  const reMacroFinder = new RegExp("("+mPrefix+")[^("+mMarker+")]+("+mMarker+")", 'g')
  const reMacroDefiner = new RegExp("("+mSpliter+")[^("+mSpliter+")]+("+mSpliter+")")
  const reMacroSpliter = new RegExp(mSpliter, 'g')
  const reMacroCallFinder = new RegExp("("+mcCallPrefix+")[^("+mSpliter+")]+("+mSpliter+")", 'g')
                                    
  fs.readFile(input, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    macros = data.match(reMacroFinder)
    if (macros == null || macros.length == 0){
      return
    }
    console.log(macros+ " " + macros.length)
    for(i =0;i<macros.length;i++){
      mcr = macros[i]
      mcrDef = reMacroDefiner.exec(mcr)
      if(mcrDef == null || mcrDef.length < 1){
        continue
      }
      mcrSpec = mcrDef[0].replace(reMacroSpliter, '')
      mcrSpecTemp = mcrSpec.split(',')
      if ( mcrSpecTemp.length == 0){
        return
      }
      mcrName = mcrSpecTemp[0]
      mcrParams = mcrSpecTemp.slice(1)
      mcrBody = mcr.substring(mPrefix.length+mcrSpec.length+mSpliter.length, mcr.length-3)  
      macros['mcrName'] = {'params':mcrParams, 'body':mcrBody}
    }
    console.log(macros)
   
    macroCalls = data.match(reMacroCallFinder)
    if (macroCalls == null || macroCalls.length == 0){
      return
    }
    console.log(macroCalls+ " " + macroCalls.length)
    for(i =0;i<macroCalls.length;i++){
      mc = macroCalls[i]
      console.log(mc)
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
