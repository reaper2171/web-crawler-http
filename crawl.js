const {JSDOM} = require('jsdom');

//function to crawl a website where pages object record pages and no. of times they have been crawled
async function crawlPage(baseUrl, currentUrl, pages){
    const currentUrlObj = new URL(currentUrl);
    const baseUrlObj = new URL(baseUrl);
    if (currentUrlObj.hostname !== baseUrlObj.hostname){   //condition to verify that we are in the same domain name
        return pages;
    }
  
    const normalizedUrl = normalizeUrl(currentUrl);

    // if we've already visited this page just increase the count and don't repeat the http request
    if (pages[normalizedUrl] > 0){
        pages[normalizedUrl]++;
        return pages;
    }

    // initialize this page in the map
     // since it doesn't exist yet
    pages[normalizedUrl] = 1
    
    console.log(`Currently crawling ${currentUrl} url`);  //Message for notifying the control flow
    let htmlBody;
    try{
        const resp = await fetch(currentUrl);             //fetching response object
        
        if(resp.status >399){                   //for handling error status codes
            console.log(`error in fetch status code: ${resp.status} on page ${currentUrl}`);
            return pages;
        }
        //for handling non-html pages
        if(!resp.headers.get("content-type").includes("text/html")){       //used includes and not !== bacuse content-type may have sonme other content-types like charset
            console.log(`Non-html content-type: ${resp.headers.get("content-type")} on page ${currentUrl}`);
            return pages;
        }   
        htmlBody = await resp.text();         //converts the response object which container info about response(like code,headers,etc) to text
    }catch(err){                                //for handling errors in url
        console.log(`error in fetch: ${err.message}, on page ${currentUrl}`);
    }
    
    const nextUrls = getUrlsFromHttp(htmlBody, baseUrl);    //for nested URLs inside the html page
    for(const nextUrl of nextUrls){
        pages = await crawlPage(baseUrl,nextUrl,pages);
    }
    return pages;
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