const express = require('express');
const Mock = require('mockjs');
const fs = require("fs")
const path = require("path")
const renderTemplate = require("any-template-compiler")
module.exports = (api, projectOptions) => {
    api.chainWebpack(webpackConfig => {
        // 通过 webpack-chain 修改 webpack 配置
    });

    api.configureWebpack(webpackConfig => {
        // 修改 webpack 配置
        // 或返回通过 webpack-merge 合并的配置对象
    });

    api.registerCommand('test', args => {
        // 注册 `vue-cli-service test`
    });

    api.configureDevServer(app => {
        let http = require('http').createServer(app)
        let io = require('socket.io')(http)
        let apiRoutes = express.Router()
        apiRoutes.get('/bar/ydys/v1', function (req, res) {
            //建设用地审批
            let json = Mock.mock({
                "array|4": [
                    {
                            "TJDATE":function(){
                                return Mock.mock('@date("yyyy/MM")')
                            },
                            "ARECODE":150000,
                            "GWYPZZMJ|1-100":1,
                            "SZFPZZMJ|1-100":1
                    }
                ],
                "tags":[
                    {
                        "value":"TJDATE",
                        "label":"月份"
                    },
                    {
                        "value":"ARECODE",
                        "label":"行政区"
                    },
                    {
                        "value":"GWYPZZMJ",
                        "label":"国务院批准总面积"
                    },
                    {
                        "value":"SZFPZZMJ",
                        "label":"省政府批准总面积"
                    }
                ]
            })
            res.json(json)
        });
        app.use('/api', apiRoutes)
        io.on('connection', function(socket){
            console.log('连接上服务器了');
            socket.on('disconnect', function(){
                console.log('断开服务器连接了');
            });
            socket.on('onChartConfig', function(config){
                let tplPath= path.join(__dirname,'src','components','chart','bar','template.tpl');
                let prePath= path.join(__dirname,'src','components','chart','preview','preview.vue');
                let tplFile = fs.readFileSync(tplPath);
                let outFile = renderTemplate(tplFile.toString(),{ config: config })
                fs.writeFileSync(prePath,outFile)
            });
        });
        http.listen(3000, function(){
            console.log('listening on *:3000');
        });
    })
};
module.exports.defaultModes = {
    build: 'development'
};