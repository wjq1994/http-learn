// 当禁用cookie的时候 怎么办
const http = require('http');
const querystring = require('querystring');
const crypto = require('crypto');
const secret = 'wang'
 const sign = (value) => {
     return crypto.createHmac('sha256', secret).update(value).digest('base64').replace(/\=/g, '').replace(/\+/g, '-').replace(/\//g,'_');

 }
let age  = 10
http.createServer((req, res) => {
    req.getCookie = function (key,opts={}) {
        let cookies = req.headers['cookie']; // name=zf; age=10
        cookies = querystring.parse(cookies, '; ');
        let cookie = cookies[key];
        let [value, s] = cookie.includes('.')?cookie.split('.') : [cookie];
        if (opts.signed){ // 如果有签名要检验
            if (sign(value) === s){ // 校验cookie的签名，如果没有更改说明值是服务端设置的
                return value
            }else{
                return ''
            }
        }
        return value
    }
    let arr = [];
   
    res.setCookie = function (key, value, options = {}) {
        let opts = [];
        let cookie = `${key}=${value}`
        if (options.maxAge) {
            opts.push(`max-age=${options.maxAge}`)
        }
        if(options.domain){
             opts.push(`domain=${options.domain}`)
        }
        if (options.httpOnly) {
            opts.push(`httpOnly=${options.httpOnly}`)
        }
        if (options.signed) {
            cookie = cookie + '.' + sign(value);
        }
        arr.push(`${cookie}; ${opts.join('; ')}`);
        res.setHeader('Set-Cookie', arr)
    }
    if (req.url === '/read') {
        res.end(req.getCookie('age',{signed:true}) || '空')
    } else if (req.url === '/write') {
        res.setCookie('name', 'zf', {
            maxAge: 10
        });
        
        res.setCookie('age', age+++'', {
            // maxAge: 10,
            httpOnly:true,
            signed:true, // 表示这个cookie 需要增加签名
        });
        res.end('write ok')
    } else {
        res.end();
    }
}).listen(3000);