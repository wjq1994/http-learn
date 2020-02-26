// session的功能 
// cookie 是不安全的 如果服务端设置的cookie 浏览器可以看到具体内容 
// session 来基于 cookie实现的安全些

const http = require('http');
const uuid = require('uuid');
console.log(uuid.v4())
console.log(uuid.v4())
const crypto = require('crypto')
const cardName = 'zfpx'; // 店铺名
const session = {}
const secret = 'zfpx';
const querystring = require('querystring')
// 记录 客户端访问服务器的次数
const sign = (value) => {
    return crypto.createHmac('sha256', secret).update(value).digest('base64').replace(/\=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

}
http.createServer((req, res) => {
    let arr =[]
    req.getCookie = function (key, opts = {}) {
        let cookies = req.headers['cookie']; // name=zf; age=10
        if (cookies) {
            cookies = querystring.parse(cookies, '; ');
            let cookie = cookies[key];
            if (cookie) {
                let [value, s] = cookie.includes('.') ? cookie.split('.') : [cookie];
                if (opts.signed) { // 如果有签名要检验
                    if (sign(value) === s) { // 校验cookie的签名，如果没有更改说明值是服务端设置的
                        return value
                    } else {
                        return ''
                    }
                }
                return value
            }
        } else {
            return ''
        }

    }
    res.setCookie = function (key, value, options = {}) {
        let opts = [];
        let cookie = `${key}=${value}`
        if (options.maxAge) {
            opts.push(`max-age=${options.maxAge}`)
        }
        if (options.domain) {
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

    if (req.url === '/visit') {
        let cardId = req.getCookie(cardName, {
            signed: true
        });
        if (cardId && session[cardId]) {
            session[cardId].visit++;
            res.setHeader('Content-Type', 'text/html;charset=utf-8')
            res.end(`欢迎第${session[cardId].visit}次访问我`)
        } else {
            // 来办张卡吧 
            let cardId = uuid.v4();
            res.setCookie(cardName, cardId, {
                signed: true
            });
            session[cardId] = {
                visit: 1
            }
            res.setHeader('Content-Type', 'text/html;charset=utf-8')
            res.end(`欢迎第一次访问我`)
        }
    }
}).listen(3000);