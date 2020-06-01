const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const argv = require('yargs').argv;
const url = require("url");
const fs = require('fs');

//this is pulled from the command line
//node lighthouse.js --url https://website.com

const launchChromeAndRunLighthouse = url => {
    return chromeLauncher.launch().then(chrome => {
      const opts = {
        port: chrome.port
      };
      return lighthouse(url, opts).then(results => {
        return chrome.kill().then(() => {
          return {
            js: results.lhr,
            json: results.report
          };
      });
    });
  };
  
  if (argv.url) {

    //to create a save file in node. 
    //Get the file, get the name, manipulate it.
    const urlObj = new URL(argv.url);
    let dirName = urlObj.host.replace("www.", ""); 
    if (urlObj.pathname !== "/") {
        dirName = dirName + urlObj.pathname.replace(/\//g, "-");
    }

    //checks to see if directory exists, else makes it
    if(!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }

    launchChromeAndRunLighthouse(argv.url).then(results => {
      const filename = results["fetchTime"].replace(/:/g, "_"); 
                
      fs.writeFile(`${dirName}/${filename}.json`, results, 
        err => {
          if (err) throw err;
        });

      // console.log(results);
      });    
  } else {
      throw "Your URL looks funky and didn't get passed to lighthouse";
  }

console.log("launched");

