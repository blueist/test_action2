const core = require('@actions/core');
const fs = require('fs')
const path = require('path');
const github = require('@actions/github');

const targetProject = "ZREQ"

const mMarker = '```'
const mSpliter = '::'
const mPrefix = mMarker+'zinno-macro'+mSpliter
const mPostfix = mMarker

const mcCallPrefix = mSpliter+'zinno-macro'+mSpliter
const mcCallPostfix = mSpliter

const reMacroFinder = new RegExp("("+mPrefix+")[^("+mMarker+")]+("+mPostfix+")", 'g')
const reMacroDefiner = new RegExp("("+mSpliter+")[^("+mSpliter+")]+("+mSpliter+")")
const reMacroSpliter = new RegExp(mSpliter, 'g')
const reMacroCallFinder = new RegExp("("+mcCallPrefix+")[^("+mSpliter+")]+("+mSpliter+")", 'g')

var macros = {}

function defineMacro(mcr){
    mcrDef = reMacroDefiner.exec(mcr)
    if(mcrDef == null || mcrDef.length < 1){
        console.log('no macro definition :'+mcr)
        return [null, null]
    }
    mcrSpec = mcrDef[0].replace(reMacroSpliter, '')
    mcrSpecTemp = mcrSpec.split(',')
    if ( mcrSpecTemp.length == 0){
        console.log('no macro spec :'+mcrSpec)
        return [null, null]
    }
    mcrName = mcrSpecTemp[0]
    mcrParams = mcrSpecTemp.slice(1)
    mcrBody = mcr.substring(mPrefix.length+mcrSpec.length+mSpliter.length, mcr.length-3)  
    return [mcrName, {'params':mcrParams, 'body':mcrBody, 'func':new Function(mcrParams, mcrBody)}]
}

function test1(){
  const input = core.getInput('input')
  console.log('read '+input)
                                    
  fs.readFile(input, 'utf8', function (err,data) {
    if (err) {
      core.setOutput("changed", 'false');
      return console.log(err);
    }
    macros = data.match(reMacroFinder)
    if (macros == null || macros.length == 0){
      core.setOutput("changed", 'false');
      return console.log('find no macros');
    }
    console.log("find " + macros.length+ " macros" )
    console.debug(macros)
    for(i =0;i<macros.length;i++){
      
      [mcrName, mcrInfo] = defineMacro(macros[i])
    //   mcrDef = reMacroDefiner.exec(mcr)
    //   if(mcrDef == null || mcrDef.length < 1){
    //     continue
    //   }
    //   mcrSpec = mcrDef[0].replace(reMacroSpliter, '')
    //   mcrSpecTemp = mcrSpec.split(',')
    //   if ( mcrSpecTemp.length == 0){
    //     continue
    //   }
    //   mcrName = mcrSpecTemp[0]
    //   mcrParams = mcrSpecTemp.slice(1)
    //   mcrBody = mcr.substring(mPrefix.length+mcrSpec.length+mSpliter.length, mcr.length-3)  
      if (mcrName!=null) {
        macros[mcrName] = mcrInfo
      }
    }
    console.log(macros)
   
    macroCalls = data.match(reMacroCallFinder)
    if (macroCalls == null || macroCalls.length == 0){
      core.setOutput("changed", 'false');
      return
    }
    
    var changes = 0
    console.log(macroCalls+ " " + macroCalls.length)
    for(i =0;i<macroCalls.length;i++){
      mc = macroCalls[i] // macro call 
      mc = mc.replace(mcCallPrefix, '').replace(mcCallPostfix, '')
      
      mcTemp = mc.split(',')
      if ( mcTemp.length == 0){
        continue
      } 
      mcName = mcTemp[0]
      mcParams = mcTemp.slice(1)
      if (!( mcName in macros)) {
        continue
      }
      mSpec = macros[mcName]
      console.log(mc+ " " + mSpec+ "  "+ mcParams.length+ "  "+ mSpec['params'].length)
      if (mcParams.length != mSpec['params'].length){
        continue
      }
      v = mSpec['func'].apply(null, mcParams)
      console.log(mc+ " " + v)
      
    }
    
    if(changes > 0) {
      fs.writeFile(input, data, 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }
      });
    }
  });

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
