const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const github = require('@actions/github');

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
    let promise = new Promise(function(resolve, reject) {
        fs.readdir(p, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
    let result = await promise; 
    console.log(result); 
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


    const currentText = await fs.readFile(path.join(process.cwd(),'../aaa.txt'), "utf8");

    // for (let i = 0; i < paths.length; i++) {
    //   console.log(i+" : " +paths[i]) 
    //   console.log(fs.readdirSync(paths[i]))
    //   // function2(paths[i])
    //   //console.log(fs.readdirSync(paths[i]))
    // }

  }catch (error) {
    core.setFailed(error.message);
  }
}

async function test2(){
  const context = github.context;
  if (context.payload.issue == null) {
      core.setFailed('No issue found.');
      return;
  }
  
  console.log(context.payload.issue.number)
  console.log(context.payload.issue.body)
  
  var Client = require('node-rest-client').Client;
  client = new Client();
// Provide user credentials, which will be used to log in to Jira.
var loginArgs = {
    data: {
        "username": "admin",
        "password": "admin"
    },
    headers: {
        "Content-Type": "application/json"
    }
};
client.post("http://localhost:8090/jira/rest/auth/1/session", loginArgs, function(data, response) {
    if (response.statusCode == 200) {
        console.log('succesfully logged in, session:', data.session);
        var session = data.session;
        // Get the session information and store it in a cookie in the header
        var searchArgs = {
            headers: {
                // Set the cookie from the session information
                cookie: session.name + '=' + session.value,
                "Content-Type": "application/json"
            },
            data: {
                // Provide additional data for the Jira search. You can modify the JQL to search for whatever you want.
                jql: "type=Bug AND status=Closed"
            }
        };
        // Make the request return the search results, passing the header information including the cookie.
        client.post("http://localhost:8090/jira/rest/api/2/search", searchArgs, function(searchResult, response) {
            console.log('status code:', response.statusCode);
            console.log('search result:', searchResult);
        });
    } else {
        throw "Login failed :(";
    }
});  
  
}
// test1();
test2()
