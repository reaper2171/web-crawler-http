const {normalizeUrl} = require('./crawl.js');
const {test, expect} = require('@jest/globals') 

test('Normalize Url', () => {
    const input = 'https://blog.boot.dev/learn/';
    const actual = normalizeUrl(input);
    const expected = 'blog.boot.dev/learn';
    expect(actual).toEqual(expected);
})