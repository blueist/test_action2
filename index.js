const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');

async function test1(){
  try{
    const input = core.getInput('input');
    const output = core.getInput('output')
    const abs1_path = path.join(process.cwd(),input)
    const abs2_path = path.join(process.cwd(),output)
    const abs3_path = path.resolve(input)
    const abs4_path = path.resolve(output)
    
    const function1 = function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      files.forEach(function (file) {
          // Do whatever you want to do with the file
          console.log(file); 
      });
  }
    console.log('a'+abs1_path) 
    fs.readdir(abs1_path, function1);
    console.log('c'+abs2_path)    
    fs.readdir(abs2_path, function1);
    console.log('e'+abs3_path)    
	  fs.readdir(abs3_path, function1);
    console.log('g'+abs4_path)    
	  fs.readdir(abs4_path, function1);
  }catch (error) {
    core.setFailed(error.message);
  }
}
 
test1();
