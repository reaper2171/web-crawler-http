const {normalizeUrl, getUrlsFromHttp} = require('./crawl.js');   
const {test, expect} = require('@jest/globals') 


//test for checking getUrlsFromHttp function
test('Get URLs from HTTP', () => {                      //basic syntax for every jest test function
    const inputHtmlBody =
    `<html>
        <body>
            <a href="http://blog.boot.dev">Boot.dev Relative</a>
            <a href="/path">Boot.dev Relative</a>
        </body>
    </html>`
    const inputUrl = 'http://blog.boot.dev';
    const responses = getUrlsFromHttp(inputHtmlBody, inputUrl);
    const expected = ['http://blog.boot.dev/','http://blog.boot.dev/path'];
    expect(responses).toEqual(expected);                //test passing condition is defined here
})


//test for checking normalizeUrl function
test('Normalize Url', () => {                            
    const input = 'https://blog.boot.dev/learn/';
    const actual = normalizeUrl(input);                  
    const expected = 'blog.boot.dev/learn';
    expect(actual).toEqual(expected);                    
})