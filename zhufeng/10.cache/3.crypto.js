// crypto 专门用来提供node中 一些常用的摘要算法 和加密算法

// 摘要 会将内容 摘要出来 但是不能反推 md5

// md5特性 1) 相同的内容 摘要出来的结果一样
//        2) 摘要的长度永远相等
//        3) 如果内容不一样 摘要出来的结果完全不一样 雪崩



let crypto = require('crypto');

// md5 
let r = crypto.createHash('md5').update('1').digest('base64');
r = crypto.createHash('md5').update('FN6kHedqzsdlkmcrw5AnXw==').digest('base64');
console.log(r);


// 加盐算法 可靠 在这个加密的时候加上自己的逻辑

// 如果服务器给客户端传递内容 我可以把结果给客户端
// 客户端请求的时候可以带过来 我再用你的信息 加上秘钥重新生成 如果和上次我给你的一样

//  用户信息 + 内部秘钥 =》 结果了 token
//  token + 用户信息带上 
let r1 = crypto.createHmac('sha256','zfp1').update('zf').digest('base64');

console.log(r1);