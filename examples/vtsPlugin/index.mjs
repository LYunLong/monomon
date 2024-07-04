import WebSocket from 'ws';
import { ApiClient } from "vtubestudio";
import findAndBind from './findAndBind.mjs'
import fs from 'fs-extra'

import express from 'express'
const HttpClient = express()
const HttpPort = 8098

HttpClient.listen(HttpPort, ()=> {
    console.info(`服务已开启监听：localhost:${HttpPort}`)
})

function setAuthToken(authenticationToken) {
    console.log('authenticationToken', authenticationToken);
    fs.writeFileSync("./auth-token.txt", authenticationToken, {
        encoding: "utf-8",
    });
}

function getAuthToken() {
    console.log('atGet', fs.readFileSync("./auth-token.txt", "utf-8"));
    return fs.readFileSync("./auth-token.txt", "utf-8");
}

//plugin options & instance
const options = {
    authTokenGetter: getAuthToken,
    authTokenSetter: setAuthToken,
    pluginName: "Action Control",
    pluginDeveloper: "LYL",
    port: 8088,
    url: `ws://localhost:8088`,
    webSocketFactory: (url) => new WebSocket(url),
  };
const apiClient = new ApiClient(options); // vts 客户端

// free 空闲  busy
let modelFree = 1

let config  // 承载配置
apiClient.hotkeysInCurrentModel().then((res) => {
    console.log('vts配置项', res.availableHotkeys);
    //预料中自动绑定id，依靠人工的匹配
    config = findAndBind(res.availableHotkeys)
    doFreeAction()
    bindHttpEvents()
});

function ActionTrigger(id, type) {
    console.log(`触发vts触发器:${id}`);
    if (!id) return
    apiClient.hotkeyTrigger({ hotkeyID: id, });
}

function ActionNameTrigger (name, type) {
    if (type && config[type] && name && config[type][name]) {
        ActionTrigger(config[type][name].keyId, type)
    }
}

function doFreeAction() {
    //切换个背景玩
    setInterval(()=>{
        if (modelFree) {
            let newId = config.bg[Object.keys(config.bg)[parseInt(Math.random () * Object.keys(config.bg).length)]].keyId
            ActionTrigger(newId)
        }
    }, 1000 * 5)

    //切换待机动作
    setInterval(()=>{
        if (modelFree) {
            let newId = config.idleMotion[Object.keys(config.idleMotion)[parseInt(Math.random () * Object.keys(config.idleMotion).length)]].keyId
            ActionTrigger(newId)
        }
    }, 1000 * 5)
}

function bindHttpEvents () {
    //触发行为（锁定模型）
    HttpClient.get('/action/trigger', (req, res)=> {
        const actionType = req.query.type
        const actionName = req.query.name
        if (actionName && actionType) {
            modelFree = 0
            ActionNameTrigger(actionName, actionType)
            res.send(`trigger:${actionType}-${actionName} success`)
        }else {
            res.send(`trigger:${actionType}-${actionName} error`)
        }
    })
    //释放模型
    HttpClient.get('/action/free', (req, res)=> {
        modelFree = 1
        res.send(`free: success`)
    })
}


