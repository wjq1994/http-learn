/**
 * 主要知识点：
 * 1. 跨域怎么产生 浏览器的限制  后端也没有跨域
 * 2. 跨域 协议 主机名 端口
 * 3. 做防盗链 利用header referer和host比较 
 */ 

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs').promises;


http.createServer(async (req, res) => {
    let {
        pathname,
        query // ? {callback:'zf'}   callback=zf
    } = url.parse(req.url, true); // 请求的真实资源路由  ./xxx

    let absPath = path.resolve(__dirname, '.' + pathname);
    try {
        let statObj = await fs.stat(absPath);
        if (statObj.isFile()) { // 目前只对文件处理

            if(pathname.match(/\.jpg/)){
                // 图片 图片我需要做防盗链
                let referer = req.headers['referer'] || req.headers['referrer'];
                if(referer){
                    // 做防盗链 
                    let host = req.headers.host.split(':')[0];
                    referer = url.parse(referer).hostname;
                    let whiteList = ['zf1.cn'];
                    if (host !== referer && !whiteList.includes(referer)) {
                         let content = await fs.readFile(path.resolve(__dirname,'2.jpg'));
                         res.end(content);
                         return;
                    }
                }
            }

            let content = await fs.readFile(absPath);
            res.end(content);
        } else {
            res.statusCode = 404
            res.end('Not Found');
        }
    } catch (e) {
        console.log(e)
        res.statusCode = 404
        res.end('Not Found'); // after write end
    }
}).listen(3000);