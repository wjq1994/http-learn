const http = require('http');
const url = require('url')
const fs = require('fs').promises;
const path = require('path');
const crpto = require('crypto');
http.createServer(async (req, res) => {
    res.setHeader('Cache-Control','no-cache'); // 每次都访问服务器
    // res.setHeader('Cache-Control','no-store'); // 客户端不缓存
    let {
        pathname
    } = url.parse(req.url);
    console.log(req.url)
    let absPath = path.join(__dirname, pathname);

    try {
        let statObj = await fs.stat(absPath);
        if (statObj.isDirectory()) { // 如果是目录就拼接index.html 
            absPath = path.join(absPath, 'index.html');
            await fs.access(absPath); // 如果不存在就404
        }
        let content = await fs.readFile(absPath, 'utf8');
        if (req.url.match(/css/)) {
            // 跟客户端说 增加修改时间
            // let ctime = statObj.ctime.toGMTString()
            // res.setHeader('Last-Modified', ctime);

            // 客户端的 第二次才有 
            // let ifModifiedSince = req.headers['if-modified-since'];
            let hash = crpto.createHash('md5').update(content).digest('base64');
            let ifNoneMatch = req.headers['if-none-match'];            
            res.setHeader('ETag', hash)

            if(ifNoneMatch === hash){
                res.statusCode = 304;
                 return res.end();
            }
            // 先将css文件进行摘要
            // if (ifModifiedSince === ctime){
            //     res.statusCode = 304;
            //     return res.end();
            // }
        }

        
        res.end(content);
    } catch (e) {
        console.log(e);
        res.end(`Not Found`)
    }
}).listen(3000);    