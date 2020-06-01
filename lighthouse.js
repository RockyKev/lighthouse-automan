const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const argv = require('yargs').argv; 
const url = require('url');
const fs = require('fs');

//Launch CHROME
const launchChromeAndRunLighthouse = url => {
  return chromeLauncher.launch().then(chrome => {
    const opts = {
      port: chrome.port
    };
    return lighthouse(url, opts).then(results => {
      //return chrome.kill().then(() => results.report);
      //return chrome.kill().then(() => results.lhr);
      return chrome.kill().then(() => {
        return {
            js: results.lhr,
            json: results.report
        };  
      })

    });
  });
};

//ACTUAL COMMAND
if (argv.url) {

    //create directory -- turn into function?
    const urlObj = new URL(argv.url);

    //create directory = create file
    let dirName = urlObj.host.replace('www.','');
    if (urlObj.pathname !== "/") {
        dirName = dirName + urlObj.pathname.replace(/\//g, "_");
    }

    //create directory
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }

    //fire function
    launchChromeAndRunLighthouse(argv.url).then(results => {
        //console.log(results);
        const filename = results.js["fetchTime"].replace(/:/g, "_");

        fs.writeFile(
            `${dirName}/${filename}.json`, 
            results.json, 
            err => {
                if (err) throw err; 
            }
        );
    });

} else {
    throw "You haven't passed a URL to Lighthouse";
}

