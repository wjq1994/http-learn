// http想实现断点续传 分段传输 你就可以使用这种方式

// 206 

// Range:bytes=0-3


// Accept-Ranges: bytes
// Content-Range: bytes 0-3/7877
const http = require('http');
const fs = require('fs');
const size = fs.statSync('./1.txt').size;
http.createServer((req,res)=>{
    let range = req.headers['range'];
    console.log(range)
    if (range) {
        let [,start,end] = range.match(/(\d+)-(\d+)/);
        start = Number(start);
        end = Number(end);
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
       fs.createReadStream('1.txt',{start,end}).pipe(res);
    }else{
        fs.createReadStream('1.txt').pipe(res);
    }
}).listen(3000);

// 写一个客户端 不停的更改 start 和 end