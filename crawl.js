function normalizeUrl(urlString){
    const urlObj = new URL(urlString);
    let url = `${urlObj.hostname}${urlObj.pathname}`;
    if(url.length>0 && url.slice(-1)==='/'){
        url = url.slice(0,-1);
    }
    return url;
}

module.exports = {
    normalizeUrl
}