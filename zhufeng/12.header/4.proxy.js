// http-proxy webpack http-proxy-middleware


// 我可能会买一个服务器 n个

// zf1.cn  => 3000
// zf2.cn  => 4000

const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer()
let map = {
    'zf1.cn':'http://localhost:3000',
    'zf2.cn':'http://localhost:4000'
}
http.createServer((req,res)=>{ // referer
    // 验证用户信息 如果是ok 去访问真实的服务器
     proxy.on('proxyRes', function (proxyRes, req, res) {
         var body = [];
         proxyRes.on('data', function (chunk) {
             body.push(chunk);
         });
         proxyRes.on('end', function () {
             body = Buffer.concat(body).toString();
             console.log("res from proxied server:", body);
             res.end("my response to cli");
         });
     });
    proxy.web(req, res, {
        selfHandleResponse: true,
        target: map[req.headers['host']]
    })
}).listen(80);

// 80