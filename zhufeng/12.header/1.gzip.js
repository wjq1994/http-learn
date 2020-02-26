// Accept-Encoding: gzip, deflate, br 客户端自己发送的
// Content-Encoding: gzip

const zlib = require('zlib');

// readFile 
// let fs = require('fs');
// zlib.gzip(fs.readFileSync('./1.txt'),function (err,data) {
//     fs.writeFileSync('1.gz', data)
// })

let fs = require('fs');
// 读取一点 -》 压缩一点 -》 写入一点   pipe

// fs.createReadStream('./1.txt').pipe(zlib.createGzip()).pipe(fs.createWriteStream('1.gz'))