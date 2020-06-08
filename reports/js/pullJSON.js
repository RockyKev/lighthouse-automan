//Step 1 - Grab what website
const report = document.querySelector('#report');
const reportSite = report.dataset.site;
const reportFile = report.dataset.file;

//step 2 - Grab the latest file


//Call JSON
//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
let requestURL = `../${reportSite}/${reportFile}`;
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
    const res = request.response;
    populateHeader(res);
    populateChecklist(res["audits"]);
    populateWebVitals(res["audits"]);
}



function populateHeader(jsonObj) {
    const headerName = document.querySelector('#reportName');
    const headerTime = document.querySelector('#reportTime');
    headerName.textContent = jsonObj['finalUrl'];
    headerTime.textContent = jsonObj['fetchTime'];

    console.log("appending... populateHeader")
}

function populateChecklist(jsonObj) {

    const list = document.querySelector('#reportChecklist');

    //PERFORMANCE:
    //https://gomakethings.com/loops-dom-injection-and-performance-with-vanilla-js/

    let html = '';

    //taken from the json itself. 
    const categoryObj = {
            "metrics": {
              "title": "Metrics", 
            },
            "load-opportunities": {
              "title": "Opportunities",
              "description": "These suggestions can help your page load faster. They don't [directly affect](https://web.dev/performance-scoring/) the Performance score."
            },
            "budgets": {
              "title": "Budgets",
              "description": "Performance budgets set standards for the performance of your site."
            },
            "diagnostics": {
              "title": "Diagnostics",
              "description": "More information about the performance of your application. These numbers don't [directly affect](https://web.dev/performance-scoring/) the Performance score."
            },
            "pwa-fast-reliable": {
              "title": "Fast and reliable"
            },
            "pwa-installable": {
              "title": "Installable"
            },
            "pwa-optimized": {
              "title": "PWA Optimized"
            },
            "a11y-best-practices": {
              "title": "Best practices",
              "description": "These items highlight common accessibility best practices."
            },
            "a11y-color-contrast": {
              "title": "Contrast",
              "description": "These are opportunities to improve the legibility of your content."
            },
            "a11y-names-labels": {
              "title": "Names and labels",
              "description": "These are opportunities to improve the semantics of the controls in your application. This may enhance the experience for users of assistive technology, like a screen reader."
            },
            "a11y-navigation": {
              "title": "Navigation",
              "description": "These are opportunities to improve keyboard navigation in your application."
            },
            "a11y-aria": {
              "title": "ARIA",
              "description": "These are opportunities to improve the usage of ARIA in your application which may enhance the experience for users of assistive technology, like a screen reader."
            },
            "a11y-language": {
              "title": "Internationalization and localization",
              "description": "These are opportunities to improve the interpretation of your content by users in different locales."
            },
            "a11y-audio-video": {
              "title": "Audio and video",
              "description": "These are opportunities to provide alternative content for audio and video. This may improve the experience for users with hearing or vision impairments."
            },
            "a11y-tables-lists": {
              "title": "Tables and lists",
              "description": "These are opportunities to to improve the experience of reading tabular or list data using assistive technology, like a screen reader."
            },
            "seo-mobile": {
              "title": "Mobile Friendly",
              "description": "Make sure your pages are mobile friendly so users don’t have to pinch or zoom in order to read the content pages. [Learn more](https://developers.google.com/search/mobile-sites/)."
            },
            "seo-content": {
              "title": "Content Best Practices",
              "description": "Format your HTML in a way that enables crawlers to better understand your app’s content."
            },
            "seo-crawl": {
              "title": "Crawling and Indexing",
              "description": "To appear in search results, crawlers need access to your app."
            },
            "best-practices-trust-safety": {
              "title": "Trust and Safety"
            },
            "best-practices-ux": {
              "title": "User Experience"
            },
            "best-practices-browser-compat": {
              "title": "Browser Compatibility"
            },
            "best-practices-general": {
              "title": "General"
            }
        };



    /*for loop that will: 
        1. find the category it belongs to
        2. put the content in the categoryGroup html section
        then another loop spits it out into html. 
    */

    for (let jsonTitle in jsonObj) {
        const audit = jsonObj[jsonTitle];

        //find the category
        

        //grab the element->title
        const title = audit["title"] ? audit["title"] : "notitle";

        //grab the element->score
        const score = audit["score"] ? audit["score"] : "noscore";
        
        //grab the element->scoreDisplayMode
        const scoreDisplayMode = audit["scoreDisplayMode"] ? audit["scoreDisplayMode"] : "noscore";
        
        //grab the element->displayValue
        const displayValue = audit["displayValue"] ?  audit["displayValue"] : "nodisplay";

        html += `<li>${title} | ${score} | ${scoreDisplayMode} | ${displayValue} </li>`;

    }

    html = `<ol class="list-decimal">${html}</ol>`;

    list.innerHTML = html;    

    console.log("appending... populateChecklist")
}



function populateWebVitals(jsonObj) {
    const lcp = document.querySelector('#lcp');
    const fid = document.querySelector('#fid');
    const cls = document.querySelector('#cls');

    // ['displayValue'];
    console.log("start... populateWebVitals");

    webVitalGenerator(lcp, "largest-contentful-paint" ,jsonObj);
    webVitalGenerator(fid, "total-blocking-time", jsonObj);
    webVitalGenerator(cls, "cumulative-layout-shift", jsonObj);

    console.log("appending... populateWebVitals")
}

const webVitalGenerator = (element, type, json) => {
        //create 'image' placeholder
        const img = document.createElement('img'); 
        img.src = 'https://via.placeholder.com/300x50'; 
        element.appendChild(img); 
    
        //create title and score
        const title = document.createElement('h3');
        title.className = "text-xl font-bold";
        title.textContent = `${json[type]["title"]} - ${json[type]["displayValue"]}`;
        element.appendChild(title); 
    
        //create description
        const description = document.createElement('p');
        description.className = "text-xs italic";
        description.textContent = json[type]["description"];
        element.appendChild(description); 

        console.log("generated... vital");
}


console.log("working!");
