const http = require('http');
let start = 0;
const size = 3;
const fs = require('fs');
let flowing = true;
process.stdin.on('data',function (data) {
    if(data.toString().includes('p')){
        flowing = false;
    }else{
        flowing = true;
        download()
    }
})
function  download() {
    http.get({
        host: 'localhost',
        port: 3000,
        headers: {
            Range: `bytes=${start}-${start+size}`
        }
    }, function (res) {
        setTimeout(() => {
            res.on('data', function (chunk) {
                fs.appendFileSync('./2.txt', chunk);
                start += chunk.length;
                let total = res.headers['content-range'].split('/')[1];
                if (start < total && flowing) {
                    download()
                }
            })
        }, 1000);
    })
}
download();

// 传一个文件 断断续续传 
// 分片删除 把一个文件分成很多片 