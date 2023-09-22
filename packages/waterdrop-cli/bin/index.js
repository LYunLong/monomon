#!/usr/bin/env node
console.info('log from waterdrop-cli')
// const process = require('process');
// //获取命令参数
// console.log(process.argv);
const yargs = require('yargs');
//通过 yargs库解析参数
console.info('name', yargs.argv.name)

const { inquirerPrompt }  =  require("./inquirer")

const { copyDir, checkMkdirExists, copyFile, copyTemplate } = require('./copy')
const path = require('path');

const { install } = require('./manager')

yargs.command(
    ['create', 'c'],
    '新建一个模板',
    function(yargs) {
        return yargs.option('name', {
            alias: 'n',
            demand: false,
            describe: '模板名称',
            type: 'string'
        })
    },
    function(argv) {
        // console.info(argv)
        inquirerPrompt(argv).then(answers=> {
            console.info(answers)
            const { name, type } = answers;
            const isMkdirExists = checkMkdirExists(
                path.resolve(process.cwd(), `./src/pages/${name}/index.js`)
            );
            if (isMkdirExists) {
                console.info(`${name}文件夹已经存在`)
            }else {
                // copyDir(
                //     path.resolve(__dirname, `./template/${type}`),
                //     path.resolve(process.cwd(), `./src/pages/${name}`)
                // )

                // copyFile(
                //     path.resolve(__dirname, `./template/${type}/index.js`),
                //     path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
                //     {
                //         name
                //     }
                // )

                copyTemplate(
                    path.resolve(__dirname, `./template/${type}/index.js`),
                    path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
                    {
                        name,
                    }
                )
                install(process.cwd(), answers)
            }
        })
    }
).argv;

