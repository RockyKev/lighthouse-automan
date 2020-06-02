const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const argv = require('yargs').argv; //for parsing arguments like bash commands 
const glob = require('glob'); //helps with pattern matching with file searches
const url = require('url');
const fs = require('fs');
const path = require('path'); 

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


const getContents = pathString => {
    const output = fs.readFileSync(
        pathString, 
        "utf8", 
        (err, results) => {
            return results;
        }
    );
    return JSON.parse(output);
};

//compare reports
// const compareReports = (from, to) => {
//     console.log(from["finalUrl"] + " " + from["fetchTime"]);
//     console.log(to["finalUrl"] + " " + to["fetchTime"]);
// }

const compareReports = (from, to) => {
    const metricFilter = [
        "first-contentful-paint",
        "first-meaningful-paint",
        "speed-index",
        "estimated-input-latency",
        "total-blocking-time",
        "max-potential-fid",
        "time-to-first-byte",
        "first-cpu-idle",
        "interactive"       
    ]

    //Turn values into percentages
    // 5.7 - 2.1 = 3.6
    // 3.6 / 5.7 = 0.63157895
    // 0.63157895 * 100 = 63.157895

    const calcPercentageDiff = (from, to) => {
        const per = ( (to - from) / from) * 100;
        return Math.round(per * 100) / 100;
    }

    for (let auditObj in from["audits"]) {
        if (metricFilter.includes(auditObj)) {
    
            const percentageDiff = calcPercentageDiff(
                from["audits"][auditObj].numericValue, 
                to["audits"][auditObj].numericValue
            );
    
            //console.log(auditObj);
            //Log color needs to change (Green for negative, red for positive, white for unchanged)
    
            logColors = {
                "red" : "\x1b[31m", 
                "white": "\x1b[37m", 
                "green": "\x1b[32m"
            };
    
            let logColor = logColors["white"];
    
            const log = ( () => {
                if (Math.sign(percentageDiff) === 1) {
                    logColor = logColors["red"];
                    return `${percentageDiff + "%"} slower`;
                } else if (Math.sign(percentageDiff) === 0) {
                    return "unchanged";
                } else {
                    logColor = logColors["green"];
                    return `${percentageDiff + "%"} faster`;
                }
            })();
    
            console.log(logColor, `${from["audits"][auditObj].title} is ${log}`)
    
        }
    }    
};


//Comparison code
if (argv.from && argv.to) {
    compareReports(
        getContents(argv.from + ".json"), 
        getContents(argv.to + ".json")
    );

    //exit early
    return ; 
}


//ACTUAL FIRE CODE
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

        //comparing previous reports block -- isolate function?
        const prevReports = glob(`${dirName}/*.json`, {
            sync: true
        });

        if (prevReports.length) {
            dates = []; 

            for (report in prevReports) {
                dates.push(
                    new Date(path.parse(prevReports[report]).name.replace(/_/g, ":"))
                );
            }

            /* DATE COMPARISON
            const alpha = new Date('2020-01-31');
            const bravo = new Date('2020-02-15');

            console.log(alpha > bravo); // false
            console.log(bravo > alpha); // true
            */

            const max = dates.reduce(function(a, b) {
                return Math.max(a, b);
            });

            //converts our date from unix -> iso format.
            const recentReport = new Date(max).toISOString();

            // const recentReportContents = ( () => {
            //     const output = fs.readFileSync(
            //         dirName + "/" + recentReport.replace(/:/g, "_") + ".json", 
            //         "utf8", 
            //         (err, results) => {
            //             return results;
            //         }
            //     );
            //     return JSON.parse(output);
            // })();

            const recentReportContents = getContents(dirName + '/' + recentReport.replace(/:/g, '_') + '.json');

            compareReports(recentReportContents, results.js);

        }




        //create file -- isolate function? 
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

