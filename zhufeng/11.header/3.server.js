/**
 * 主要知识点：
 * 1. Accept-Language: zh-CN,zh;q=0.9 访问3000 端口 我希望根据设置的header 显示不同的语言
 */
const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs').promises;

let defaultLanguage = 'hello';
let languages = {
    'zh-CN':{
        message: '你好'
    },
    ja:{
        message:"xxx"
    }
}
// 多语言 必须要自己使用语言包  根据不同的路径  返回不同的语言
// 前端实现 
http.createServer(async (req, res) => {
    let {
        pathname,
        query 
    } = url.parse(req.url, true);

    let absPath = path.resolve(__dirname, '.' + pathname);
    try {
        let statObj = await fs.stat(absPath);
        if (statObj.isFile()) {
            let content = await fs.readFile(absPath);
            res.end(content);
        } else {
            
            res.statusCode = 404
            res.end('Not Found');
        }
    } catch (e) {
        if (pathname === '/encoding') {
            console.log(req.headers)
            let language = req.headers['accept-language'];
            // zh-CN zh;q=0.9 en;q=0.7 [{name:'zh-CN',q:1},{name:'zh-CN',q=1},{name:'zh-CN',q=1}]
            if(language){
                let lans = language.split(',').map(item=>{
                    let [name,q] = item.split(';');
                    return {
                        name,
                        q:q?q.split('=')[1]:1
                    }
                }).sort((a,b)=>b.q-a.q)
                for(let i = 0 ; i < lans.length; i++){
                   if (languages[lans[i].name]){
                       // 说明有这个语言 
                       res.end(languages[lans[i].name].message);
                       return;
                   }
                }
                  res.end(defaultLanguage);
            }else{
                res.end(defaultLanguage);
            }
            return
        }
        res.statusCode = 404
        res.end('Not Found'); // after write end
    }
}).listen(3000);