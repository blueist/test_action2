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
    console.log('a'+abs1_path) 
    console.log('b'+fs.readdirSync(abs1_path))
    console.log('c'+abs2_path)    
  	console.log('d'+fs.readdirSync(abs2_path))
    console.log('e'+abs3_path)    
	  console.log('f'+fs.readdirSync(abs3_path))
    console.log('g'+abs4_path)    
	  console.log('h'+fs.readdirSync(abs4_path))
  }catch (error) {
    core.setFailed(error.message);
  }
}
 
test1();
