const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');

async function test1(){


  const function1 = function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    console.log('files :'+files)
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
  }

  async function function2 (p) {
    console.log("*****************"); 
    let promise = new Promise(function(resolve, reject) {
        fs.readdir(p, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
    let result = await promise; 
    console.log("*****************"); 
    console.log(result); 
    console.log("*****************"); 
    return result
  };

  try{
    paths = []
    const input = core.getInput('input')
    // const output = core.getInput('output')

    paths.push(path.join(process.cwd(),''))
    paths.push(path.resolve('.'))

    // paths.push(path.join(process.cwd(),input))
    // paths.push(path.join(process.cwd(),output))

    // paths.push(path.resolve(input))
    // paths.push(path.resolve(output))


    
    for (let i = 0; i < paths.length; i++) {
      console.log(i+" : " +paths[i]) 
      console.log("------------")
      function2(paths[i])
      console.log("---------------------")
      //console.log(fs.readdirSync(paths[i]))
    }

  }catch (error) {
    core.setFailed(error.message);
  }
}
 
test1();
