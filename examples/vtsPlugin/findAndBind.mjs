import * as config from './config.mjs'

export default function findAndBind (keyConfigs) {

    // 对于EXP的相关绑定
    Object.keys(config.exp) .forEach(item => {
        let find
        keyConfigs.forEach(keyConfig=>{
            if (keyConfig.name == item && keyConfig.type == 'ToggleExpression') { config.exp[item].keyId = keyConfig.hotkeyID; console.log(`检索到${config.exp[item].name}exp，获取绑定id为:${keyConfig.hotkeyID}`); find = 1; }
        })
        !find && console.log(`** Error ${config.exp[item].name}exp未检索到对应配置，请检查vts！**`);
    });

    // 对于Motion3的相关绑定
    Object.keys(config.motion) .forEach(item => {
        let find
        keyConfigs.forEach(keyConfig=>{
            if (keyConfig.name == item && keyConfig.type == 'TriggerAnimation') { config.motion[item].keyId = keyConfig.hotkeyID; console.log(`检索到${config.motion[item].name}motion:${keyConfig.hotkeyID}`); find = 1; }
        })
        !find && console.log(`** Error ${config.motion[item].name}motion未检索到对应配置，请检查vts！**`);
    });

    // 对于切换待机动画IdleMotion3的相关绑定
    Object.keys(config.idleMotion) .forEach(item => {
        let find
        keyConfigs.forEach(keyConfig=>{
            if (keyConfig.name == item && keyConfig.type == 'ChangeIdleAnimation') { config.idleMotion[item].keyId = keyConfig.hotkeyID; console.log(`检索到${config.idleMotion[item].name}idleMotion:${keyConfig.hotkeyID}`); find = 1; }
        })
        !find && console.log(`** Error ${config.idleMotion[item].name}idleMotion 未检索到对应配置，请检查vts！**`);
    });

    // 对于切换背景相关绑定
    Object.keys(config.bg) .forEach(item => {
        let find
        keyConfigs.forEach(keyConfig=>{
            if (keyConfig.name == item && keyConfig.type == 'ChangeBackground') { config.bg[item].keyId = keyConfig.hotkeyID; console.log(`检索到${config.bg[item].name}背景:${keyConfig.hotkeyID}`); find = 1; }
        })
        !find && console.log(`** Error ${config.bg[item].name}背景 未检索到对应配置，请检查vts！**`);
    });

    // 对于切换挂件场景的相关绑定
    Object.keys(config.item) .forEach(item => {
        let find
        keyConfigs.forEach(keyConfig=>{
            if (keyConfig.name == item && keyConfig.type == 'ToggleItemScene') { config.item[item].keyId = keyConfig.hotkeyID; console.log(`检索到${config.item[item].name}挂件场景:${keyConfig.hotkeyID}`); find = 1; }
        })
        !find && console.log(`** Error ${config.item[item].name}挂件场景 未检索到对应配置，请检查vts！**`);
    });

    // 对于系统类触发的相关绑定
    Object.keys(config.system) .forEach(item => {
        let find
        keyConfigs.forEach(keyConfig=>{
            if (keyConfig.name == item) { config.system[item].keyId = keyConfig.hotkeyID; console.log(`检索到${config.system[item].name}系统项:${keyConfig.hotkeyID}`); find = 1; }
        })
        !find && console.log(`** Error ${config.system[item].name}系统项 未检索到对应配置，请检查vts！**`);
    });

    

    console.log(`当前配置表`, config)
    return config;
    
}  