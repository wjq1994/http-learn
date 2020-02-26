const http = require('http');

http.createServer((req,res)=>{
    let headers = req.headers['user-agent'];
    res.statusCode = 302; // 301 永久重定向  302 是临时重定向
    console.log(headers.match(/iPhone/))
    if (headers.match(/iPhone|Andriod/)){
        // redirect
        res.setHeader('Location','http://www.baidu.com')
    }else{
        res.setHeader('Location', 'http://www.zhufengpeixun.com')
    }
      res.end();
}).listen(3000)