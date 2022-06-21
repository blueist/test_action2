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
        console.log('* no macro definition :'+mcr)
        return [null, null]
    }
    mcrSpec = mcrDef[0].replace(reMacroSpliter, '')
    mcrSpecTemp = mcrSpec.split(',')
    if ( mcrSpecTemp.length == 0){
        console.log('* no macro spec :'+mcrSpec)
        return [null, null]
    }
    mcrName = mcrSpecTemp[0]
    mcrParams = mcrSpecTemp.slice(1)
    mcrBody = mcr.substring(mPrefix.length+mcrSpec.length+mSpliter.length, mcr.length-3)  
    return [mcrName, {'params':mcrParams, 'body':mcrBody, 'func':new Function(mcrParams, mcrBody)}]
}

function callMacro(mc){
    mc = mc.replace(mcCallPrefix, '').replace(mcCallPostfix, '')
    mcTemp = mc.split(',')
    if ( mcTemp.length == 0){
        console.log('* invalid macro call :'+mc)
        return null
    } 
    mcName = mcTemp[0]
    mcParams = mcTemp.slice(1)
    if (!( mcName in macros)) {
        console.log('no macro definition :'+mcName)
        return null
    }
    mSpec = macros[mcName]
    if (mcParams.length != mSpec['params'].length){
        console.log('invalid macro params : needs '+ mSpec['params'].length+  " but get " +  mcParams)
        return null
    }
    return mSpec['func'].apply(null, mcParams)
}

function run(){
  const input = core.getInput('input')
  console.log('* read '+input)
                                    
  fs.readFile(input, 'utf8', function (err,data) {
    if (err) {
      core.setOutput("changed", 'false');
      return console.log(err);
    }
    data = data.replace(/(<!--)[^(<!)]+(-->)/g, '') // strip comment
    macros = data.match(reMacroFinder)
    if (macros == null || macros.length == 0){
      core.setOutput("changed", 'false');
      return console.log('* find no macros');
    }
    console.log("* find " + macros.length+ " macros" )
    console.debug(macros)
    for(i =0;i<macros.length;i++){
      [mcrName, mcrInfo] = defineMacro(macros[i])
      if (mcrName!=null) {
        macros[mcrName] = mcrInfo
      }
    }
    macroCalls = data.match(reMacroCallFinder)
    if (macroCalls == null || macroCalls.length == 0){
      core.setOutput("changed", 'false');
      return console.log('* find no macro calls');
    }
    
    console.log("* find " + macroCalls.length+ " macro calls" )
    console.debug(macroCalls)
    var changes = 0
    for(i =0;i<macroCalls.length;i++){
      v = callMacro(macroCalls[i])
      if(v != null) {
        console.log(macroCalls[i]+ " " + v)
        data.replace(macroCalls[i], "<!--"+macroCalls[i]+"-->")
        // changes++
      }
    }
    console.log(data)
    if(changes > 0) {
      fs.writeFile(input, data, 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }
      });
    }
  });
}

run()
