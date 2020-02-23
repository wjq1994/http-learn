const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
let mime = require('mime');

// async + await
http.createServer(function (req, res) {
    let {
        pathname
    } = url.parse(req.url); // /public/index.html

    let absPath = path.join(__dirname,'public',pathname);

    fs.stat(absPath,function (err,statObj) {
        if(err){ // 如果路径不存在 就是不存在文件
            return res.end(`Not found`)
        }
        if(statObj.isDirectory()){ // 如果是目录应该查找index.html
            absPath = path.join(absPath, 'index.html');
            fs.stat(absPath,function (err,statObj) {
                if(err){
                     return res.end(`Not found`)
                }
                 res.setHeader('Content-Type', 'text/html;charset=utf-8');
                 fs.createReadStream(absPath).pipe(res);
            })
        }else{
            // mime
            let type = mime.getType(absPath)
            if (!type) {
                res.setHeader('Content-Disposition', `attachment;filename=${encodeURIComponent('下载')}` + path.extname(absPath))
            }else{
                res.setHeader('Content-Type', type + ';charset=utf-8');
            }

            fs.createReadStream(absPath).pipe(res); // 会默认调用可写流的write和end方法
        }
    })
}).listen(3000)

