// 1. 安装依赖
// 2. 创建eslint、Babel、deft.config.js
// 3. 把base文件输入到deft.config.js
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ejs = require('ejs');
module.exports = async () => {
    let prompt = [
        {
            type: 'checkbox',
            name: 'webpack',
            message: '请选择你需要的webpack配置?',
            choices: [
                { name: '解析less', value: 'dealLess' },
                { name: '解析sass', value: 'dealSass' },
                { name: '解析typescript', value: 'dealTs' },
                { name: '解析图片', value: 'dealImage' },
                { name: '解析字体', value: 'dealFont' },
                { name: 'terserPlugin', value: 'terserPlugin' },
            ]
        },
    ]
    inquirer.prompt(prompt).then((answer) => {
        // process.cwd() /Users/lius/Desktop/demo
        // __dirname     /Users/lius/Desktop/so-deft/core/api/init
        // process.env.HOME /Users/local/home
        // process.dirname
        const UTF8 = 'utf-8';
        const arrToObj = (arr) => {
            const ret = {}
            arr.map((item) => {
                ret[item] = true;
            })
            return ret;
        }
        // 缓存目录
        const cacheDir = path.join(__dirname, '../../../cache/');
        // sobuild配置文件路径
        const source = path.join(cacheDir, 'webpack.dev.ejs');
        // 生成sobuild配置文件路径
        // const soBuildJsonPath = path.join(process.cwd(), 'sobuild.config.json')
        // const srcSoBuildBasePath = path.join(cacheDir, 'sobuild.base.json');
        // sobuild配置文件内容
        // const soBuildBaseConfig = fs.readFileSync(srcSoBuildBasePath, UTF8);
        // const soBuildConfig = _.merge({}, JSON.parse(soBuildBaseConfig), answer);

        // const soBuildJsonCont = JSON.stringify(soBuildConfig, null, '\t');

        // webpack基础配置内容
        const srcContent = fs.readFileSync(source, UTF8);

        // 把配置写到根目录
        // fs.writeFileSync(soBuildJsonPath, soBuildJsonCont, UTF8);

        const inquirerConfig = arrToObj(answer.webpack);

        const target = ejs.render(srcContent, inquirerConfig);

        const generatorPath = path.join(cacheDir, 'webpack.base.js');

        fs.writeFileSync(generatorPath, target, UTF8);

        const sobuildDevContent = fs.readFileSync(path.join(cacheDir, 'sobuild.dev.js'), UTF8)
        const sobuildProdContent = fs.readFileSync(path.join(cacheDir, 'sobuild.prod.js'), UTF8)
        fs.writeFileSync(path.join(process.cwd(), 'sobuild.dev.js'), sobuildDevContent, UTF8);
        fs.writeFileSync(path.join(process.cwd(), 'sobuild.prod.js'), sobuildProdContent, UTF8);
    })
};