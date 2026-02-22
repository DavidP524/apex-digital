const https = require('https');
https.get('https://unsplash.com/napi/search/photos?query=dark+modern+desk+setup&per_page=10', res => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => console.log(JSON.parse(data).results.map(r => r.id + ': ' + r.alt_description)));
});
https.get('https://unsplash.com/napi/search/photos?query=abstract+black+architecture&per_page=10', res => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => console.log(JSON.parse(data).results.map(r => r.id + ': ' + r.alt_description)));
});
https.get('https://unsplash.com/napi/search/photos?query=black+glass+abstract+gold&per_page=10', res => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => console.log(JSON.parse(data).results.map(r => r.id + ': ' + r.alt_description)));
});
