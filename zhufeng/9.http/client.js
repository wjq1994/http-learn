// 可以发送请求
const http = require('http');

// 可以发送get请求 没有请求体
// http.get()
// http-headers
let options = {
    host: 'localhost',
    port: 3000,
    path: '/',
    method: 'post',
    headers:{
        'Content-Type':'application/x-www-form-urlencoded'
    }
}
let client = http.request(options, function (res) {
   res.on('data',function (chunk) {
    console.log(chunk.toString())
   });
});
// a=1&b=2
client.end("name=zf:a=1")