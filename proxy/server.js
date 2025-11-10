// Simple proxy server for Kude The Dude V1
const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet({contentSecurityPolicy: false}));
app.use(cors());
app.use(express.static('../frontend'));


// VERY IMPORTANT: add an allowlist in production
const DOMAIN_ALLOWLIST = null; // e.g. ['example.com']


app.get('/proxy', async (req, res) => {
const rawUrl = req.query.url;
if(!rawUrl) return res.status(400).send('Missing url param');
const url = decodeURIComponent(rawUrl);


try{
// optional allowlist check
if(DOMAIN_ALLOWLIST){
const hostname = new URL(url).hostname.replace(/^www\./,'');
if(!DOMAIN_ALLOWLIST.includes(hostname)) return res.status(403).send('Domain not allowed');
}


const resp = await fetch(url, {headers: { 'User-Agent': 'KudeProxy/1.0' }});
const contentType = resp.headers.get('content-type') || '';
let body = await resp.text();


// Remove problematic headers (can't remove remote headers, but we serve the body ourselves)


// Inject a <base> tag so relative URLs resolve (helps for many sites)
try{
const origin = new URL(url).origin;
if(/<base[^>]*>/i.test(body)){
// don't add if base exists
} else if(/<head[^>]*>/i.test(body)){
body = body.replace(/<head([^>]*)>/i, `<head$1><base href="${origin}/">`);
} else {
body = `<base href="${origin}/">` + body;
}
}catch(e){/* ignore */}


// set same-origin content type
res.set('content-type', contentType);
res.set('x-proxy-by', 'kude-proxy');
res.send(body);
}catch(err){
console.error('proxy error', err);
res.status(500).send('Proxy fetch failed: ' + String(err.message));
}
});


app.listen(PORT, ()=> console.log('Kude proxy running on', PORT));
