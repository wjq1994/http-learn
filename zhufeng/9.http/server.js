const http = require('http');
const querystring = require('querystring');
const port = 3000;
// 接受请求
http.createServer(function (req, res) {
    let contentType = req.headers['content-type']
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    let arr = [];
    req.on('data', function (chunk) {
        arr.push(chunk)
    });
    req.on('end', function () {
        let str = Buffer.concat(arr).toString();
        if (contentType === 'application/json') {
            let obj = JSON.parse(str);
            res.end(obj.name);
        } else if (contentType === 'application/x-www-form-urlencoded') {
            // 默认支持表单格式 也可以手动指定分隔符
            let obj = querystring.parse(str,':','=');
             res.end(obj.name);
            // name=zf  & a=1  &  b=2 
            // let obj = {};
            // str.replace(/([^&]+)=([^&]+)/g,function(){
            //     obj[arguments[1]] =arguments[2]
            // })
            // console.log(obj);
            
        }else{
            res.end('not support');
        }

    })


}).listen(port, function () {
    console.log('server start' + port)
});

// 我访问某个页面 可以动态的将页面返给我 
// http://localhost:3000/public/index.css