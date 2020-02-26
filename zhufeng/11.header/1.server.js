/**
 * 主要知识点: 
 * 1. 跨域 （cors是指资源共享，通过服务器设置header，可以实现浏览器跨域）
 *    1）复杂请求 先发option请求预检，服务器可以携带支持跨域信息
 * 2. jsonp
 */

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs').promises;


http.createServer(async (req, res) => {
    let {
        pathname,
        query // ? {callback:'zf'}   callback=zf
    } = url.parse(req.url,true); // 请求的真实资源路由  ./xxx

    let absPath = path.resolve(__dirname, '.' + pathname);
    // 1）判断是否是api接口
    try {
        let statObj = await fs.stat(absPath);
        if (statObj.isFile()) { // 目前只对文件处理
            let content = await fs.readFile(absPath);
            res.end(content);
        } else {
            res.statusCode = 404
            res.end('Not Found');
        }
    } catch (e) {
        // 2）有可能是api接口  restful风格  根据相同的资源路径 和不同的请求方法 来做不同的处理
        let type = req.headers['content-type'];
        let arr = [];
        req.on('data', function (chunk) {
            arr.push(chunk);
        });
        req.on('end', function () {
            // 允许跨域
            if (req.headers.origin) { // 只针对跨域来处理 没有跨域是不需要处理的
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
                // 允许携带cookie凭证
                res.setHeader('Access-Control-Allow-Credentials', true);
                // 允许携带哪些header
                res.setHeader('Access-Control-Allow-Headers', 'token');
                // 最大存活时间是多少
                // res.setHeader('Access-Control-Max-Age', "10");
                res.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE,OPTIONS')
                // 如果是options直接断开
                if (req.method === 'OPTIONS') { // 跨域访问我 prefight
                    return res.end();
                }
                if (pathname === '/user') { // 路由根据不同的路径返回不同的内容
                    switch (req.method) {
                        case 'GET':
                            res.setHeader('Content-Type', 'application/json')
                            return res.end(JSON.stringify({
                                name: 'zf'
                            }))
                            break;
                        case "POST":
                            if (type === 'application/x-www-form-urlencoded') {
                                let str = Buffer.concat(arr).toString()
                                let data = require('querystring').parse(str);
                                res.setHeader('Content-Type', 'application/json')
                                res.end(JSON.stringify(data));
                            }
                            case "DELETE":
                                res.setHeader('Content-Type', 'application/json');
                                console.log(req.headers)
                                res.setHeader('Set-Cookie', 'name=zf')
                                return res.end(JSON.stringify({
                                    name: 'zf'
                                }))
                            default:
                                break;
                    }
                }
            }

            console.log(pathname)
            if (pathname === '/jsonp') {
                // zf('a=1')
               return res.end(`${query.callback}('a=1')`)
            }
            res.statusCode = 404
            res.end('Not Found'); // after write end
        })


    }
}).listen(3000);

// 跨域怎么产生 浏览器的限制  后端也没有跨域
// 跨域 协议  主机名  端口 