/**
 * 涉及到的知识点
 * header user-agent Location
 * 状态码 301(永久重定向，第一次正常访问，第二次直接访问上一次重定向的地址，永久改变，只能手动清缓存) 302(暂时性重定向)
 */
let http = require("http");

http.createServer((req, res) => {
    let userAgent = req.headers["user-agent"];
    res.statusCode = 301;
    //如果第一次访问 苹果手机对应百度
    if (userAgent.match(/iPhone/)) {
        res.setHeader("Location", "http://www.baidu.com");
    } else {
        res.setHeader("Location", "http://www.bilibili.com");
    }
    res.end();
}).listen(3000)