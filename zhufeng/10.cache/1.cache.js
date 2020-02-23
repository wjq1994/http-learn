const http = require('http');
const url = require('url')
const fs = require('fs').promises;
const path = require('path');
http.createServer(async (req,res)=>{
    let {
        pathname
    } = url.parse(req.url);
    console.log(req.url)
    let absPath = path.join(__dirname,pathname);
    
    try{
        // 判断文件的状态
       let statObj =  await fs.stat(absPath);
       if(statObj.isDirectory()){ // 如果是目录就拼接index.html 
           absPath = path.join(absPath, 'index.html');
           await fs.access(absPath); // 如果不存在就404
       }
       // 1) 第一次直接将文件返回回去了 首页不会被强制缓存
       res.setHeader('Expires',new Date(Date.now()+10*1000).toGMTString());
       res.setHeader('Cache-Control','max-age=10')
       let content = await fs.readFile(absPath, 'utf8'); // 不是目录将文件读取出来直接返回即可
       res.end(content);
    }catch(e){
        res.end(`Not Found`)
    }
}).listen(3000);

// 1) 优点就是根本不会像服务器发请求  缺点会导致缓存