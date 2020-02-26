// cookie session localStorage sessionStorage区别
// 存储的位置 cookie 存在浏览器的  而且浏览器可以篡改 可以做签名 cookie每次请求都会带上 浪费流量  4k 

// session 基于cookie 是存在于服务器的 相对于cookie是安全的  csrf 攻击 session 重启服务器消失 -》 redis 、 mongo 大小限制内存限制 

// localStorage 存在本地 不能跨域访问  默认不销毁 需要手动清除  5m

// sessionStroage 浏览器关掉销毁


// 客户端可以设置 服务器也可以设置 

const http = require('http');
http.createServer((req, res) => {
    req.getCookie = function (key) {
        let obj = require('querystring').parse(req.headers['cookie'], '; ') // name=zf; age=10
        return obj[key]
    }
    let cookies = []
    res.setCookie = function (key,value,opts={}) {
        let arr = [];
        if(opts.httpOnly){
            arr.push(`httpOnly=true`)
        }
        if(opts.maxAge){
            arr.push(`max-age=${opts.maxAge}`)
        }
        // domain path
        cookies.push(`${key}=${value}; ${arr.join('; ')}`);
        res.setHeader('Set-Cookie', cookies)
    }   
    if (req.url === '/read') {
        let name = req.getCookie('name');
        res.end(name || '空');
    } else if (req.url === '/write') {
        // 可以设置同域名下 domain 
        // 设置path 一般不会设置  以这个路径开头就可以 path路径
        // expires  304 缓存效果是一样的  expires 绝对的  max-age 多少秒过期
        // httpOnly 不能在客户端获取到
        res.setCookie('name','zf',{httpOnly:true});
        res.setCookie('age','10');
        // res.setHeader('Set-Cookie', ["name=zf; httpOnly=true", "age=10"]);
        res.end('Write ok');
    }
    // 签名  // session // jwt 原理 // koa 原理 -> 用法 promise async + await 
    // koa -> express
}).listen(3000);