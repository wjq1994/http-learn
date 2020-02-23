#! /usr/bin/env nodemon

// 解析用户的参数

let progarm = require('commander');
let configs = {
    '-p,--port <val>':'set http-server port',
    '-d,--dir <dir>':'set http-server directory',
}

Object.entries(configs).forEach(([key, value]) => {
    progarm.option(key,value)
});
progarm.name("zh-server").usage('<options>')
progarm.on('--help',function () {
    console.log('Examples:');
    console.log(`  $ zh-server --port 3000`);
})
let obj = progarm.parse(process.argv); // 用户传递的配置

let Server = require('../http-server/Server');


let defaultConfig = {
    port: 3000,
    dir: process.cwd(),

    ...obj
} // 用用户的输入的参数 覆盖掉默认参数 ，创建服务，并且开启服务
let server = new Server(defaultConfig);
server.start();