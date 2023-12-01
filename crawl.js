const {JSDOM} = require('jsdom');

function getUrlsFromHttp(htmlBody, baseUrl){
    const urls = [];
    const dom = new JSDOM(htmlBody);                  //JSDOM - function in jsdom to store the html body a dom object in memory
    const linkedElements = dom.window.document.querySelectorAll('a');
    for(const linkedElement of linkedElements){
        if(linkedElement.href.slice(0,1)==='/'){      //condition for relative urls
            urls.push(`${baseUrl}${linkedElement.href}`);
        }
        else{
            urls.push(linkedElement.href);           
        }              
    }
    return urls;
}

function normalizeUrl(urlString){               
    const urlObj = new URL(urlString);
    let url = `${urlObj.hostname}${urlObj.pathname}`;
    if(url.length>0 && url.slice(-1)==='/'){         //slice function is used to get string indexes, -1 being 1st from last
        url = url.slice(0,-1);
    }
    return url;
}

module.exports = {          //code for exporting the functions defined above in other files
    normalizeUrl,
    getUrlsFromHttp
}