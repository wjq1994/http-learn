// Accept-Encoding: gzip, deflate, br 客户端自己发送的
// Content-Encoding: gzip
const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
http.createServer((req,res)=>{
    if(req.url === '/index.html'){
        // 判断一下 是否支持gzip
        let headers = req.headers['accept-encoding'];
        if(headers.match(/\bgzip\b/)){
            res.setHeader('Content-Encoding','gzip');
            res.setHeader('Content-Type','text/html;charset=utf-8')
            fs.createReadStream('./index.html').pipe(zlib.createGzip()).pipe(res)
        }else if(headers.match(/\bdeflate\b/)){
            //  res.setHeader('Content-Encoding', 'deflate')
             fs.createReadStream('./index.html').pipe(zlib.createDeflate()).pipe(res)
        }else{
             fs.createReadStream('./index.html').pipe(res)
        }
    }else{
        res.statusCode = 404;
        res.end();
    }
}).listen(3000);