const copydir = require('copy-dir');
const fs = require('fs');
const path = require('path');



function copyDir(from, to, options) {
    mkdirGuard(to);
    copydir.sync(from, to, options);
}
function checkMkdirExists(path) {
    return fs.existsSync(path);
}
exports.checkMkdirExists = checkMkdirExists;
exports.copyDir = copyDir;



function mkdirGuard(target) {
    try {
        fs.mkdirSync(target, { recursive: true })
    }catch (e) {
        function mkdirp(dir) {
            if (fs.existsSync(dir)) { return true }
            const dirname = path.dirname(dir);
            mkdirp(dirname);
            fs.mkdirSync(dir);
        }
        mkdirp(target)
    }
}
exports.mkdirGuard = mkdirGuard;


function copyFile(from, to) {
    const buffer = fs.readFileSync(from);
    const parentPath = path.dirname(to);
    mkdirGuard(parentPath);
    fs.writeFileSync(to, buffer);
}
exports.copyFile = copyFile;


const Mustache = require('mustache');
function readTemplate(path, data = {}) {
    const str = fs.readFileSync(path, {encoding: 'utf8'});
    return Mustache.render(str, data);
}
function copyTemplate(from, to, data = {}) {
    if (path.extname(from) !== '.js') { //notuse
        return copyFile(from, to)
    }
    const parentToPath = path.dirname(to);
    mkdirGuard(parentToPath);
    data = { name: 'testName', list: ['op1', 'op2'], itemMe(){ return this + '!' }, list1: [1,2,3], html: '<span>666</span>' }
    fs.writeFileSync(to, readTemplate(from, data))
}
exports.readTemplate = readTemplate;
exports.copyTemplate = copyTemplate;