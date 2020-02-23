// http-server
/**
 * 涉及到的知识点
 * 1. 静态http-server构建
 * 2. http缓存策略 强制缓存 对比缓存 返回304（通知浏览器资源没有改变）
 * 3. package.json -> bin, npm link 将命令绑定到全局，任意目录下终端都可以执行bin里的命令
 * 4. path，fs，url，nunjucks，mime模块
 */
let http = require('http');
let url = require('url');
let path = require('path');
const fs = require('fs').promises;
const {
    createReadStream,
    createWriteStream,
    readFileSync
} = require('fs');

//第三方模块
let nunjucks = require('nunjucks');
let mime = require('mime');

class Server {
    defaultConfig = {
        port: 3000
    }
    constructor(config) {
        this.config = Object.assign({}, this.defaultConfig, config);
    }
    sendFile(currentPath, req, res, statObj) {
        if (this.hasCache(currentPath,req,res, statObj)) {
            res.statusCode = 304;
            return res.end();
        }
        res.setHeader('Content-Type', mime.getType(currentPath) + ';charset=utf8');
        createReadStream(currentPath).pipe(res);
    }
    //缓存策略
    hasCache(currentPath,req,res, statObj) {
        // 静态服务的功能 ，尽可能全部缓存  http-server -c-1

        // 缓存的页面 首屏有很多数据 很多接口
        // 模板 + 数据进行渲染 =》 客e户端  rdis

        // spa => ssr + 预渲染 + loading  + 合并接口 + cdn加载资源 

        // 加一次缓存
        // 强制缓存 10s之内浏览器不会访问服务器，会从浏览器本地获取
        res.setHeader('Cache-Control', 'max-age=10000');
        // 版本兼容 功能同上
        res.setHeader('Expires', new Date(Date.now() + 10000 * 1000).toGMTString());
        // 对比缓存 对比文件更改的时间
        let ctime = statObj.ctime.toGMTString()
        res.setHeader('Last-Modified', ctime);
        let content = readFileSync(currentPath,'utf8');
        //根据md5特性，将文件编码进行比较
        let etag = require('crypto').createHash('md5').update(content).digest('base64');
        // Etag标签对比文件内容是否改变
        res.setHeader('Etag', etag);

        // 第二次访问的时候 取值
        let ifModifiedSince = req.headers['if-modified-since'];
        let ifNoneMatch = req.headers['if-none-match'];
        // 可能一秒内 改变了多次 浏览器机制（响应头部返回Last-Modified，则请求头部返回if-modified-since）
        if (ifModifiedSince !== ctime){ // 如果当前用户传递过来的 和 当前状态不一样说明没有缓存
            return false;
        }
        // 在比较内容 浏览器机制（响应头部返回Etag，则请求头部返回if-none-match）
        if (etag !== ifNoneMatch){
            return false;
        }
        return true;
    }
    sendError(err, res) { // 发射错误
        res.statusCode = 404;
        res.end(`Not Found`)
    }
    /**
     * 处理请求的方法
     */
    async handleRequest(req, res) { // bind this更改
        console.log('服务器接收成功==============');
        let {
            pathname
        } = url.parse(req.url);
        let dir = this.config.dir;
        //将127.0.0.1的路径对应成dir的路径
        //http://127.0.0.1/demo = dir/demo
        let absPath = path.join(dir, pathname);
        absPath = decodeURIComponent(absPath);
        try {
            let statObj = await fs.stat(absPath);
            if (statObj.isFile()) {
                this.sendFile(absPath, req, res, statObj);
            } else {
                // 获取文件列表
                let children = await fs.readdir(absPath);
                // 数据  + 模板引擎 ejs nunjucks
                children = children.map((item, index) => {
                    console.log(item)
                    return {
                        current: item,
                        parent: path.join(pathname, item)
                    }
                });
                let templateStr = nunjucks.render(path.resolve(__dirname, 'template.html'), {
                    items: children
                });
                res.setHeader('Content-Type', 'text/html;charset=utf8');
                res.end(templateStr);
            }
        } catch (error) {
            console.error(error);
            sendError(error, res);
        }
    }
    start() {
       let server = http.createServer(this.handleRequest.bind(this));
       let config = this.config;
       server.listen(config.port, (res) => {
            console.log('服务器启动成功==============');
       })
    }

}

module.exports = Server;