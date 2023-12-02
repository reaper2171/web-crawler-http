const {JSDOM} = require('jsdom');

//function to crawl a single webpage
async function crawlPage(currentUrl){
    console.log(`Currently crawling ${currentUrl} url`);  //Message for notifying the control flow
    try{
        const resp = await fetch(currentUrl);             //fetching response object
        
        if(resp.status >399){                   //for handling error status codes
            console.log(`error in fetch status code: ${resp.status} on page ${currentUrl}`);
            return;
        }
        //for handling non-html pages
        if(!resp.headers.get("content-type").includes("text/html")){       //used includes and not !== bacuse content-type may have sonme other content-types like charset
            console.log(`Non-html content-type: ${resp.headers.get("content-type")} on page ${currentUrl}`);
            return;
        }   

        console.log(await resp.text());         //converts the response object which container info about response(like code,headers,etc) to text
    }catch(err){                                //for handling errors in url
        console.log(`error in fetch: ${err.message}, on page ${currentUrl}`);
    }                           
}

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
    getUrlsFromHttp,
    crawlPage
}