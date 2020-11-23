const request = require('request')
const semver = require('semver')
const chalk = require('chalk')
const packageConfig = require('../package.json')

module.exports = done => {
    // 判断node和npm版本
    const requiredVersion = packageConfig.engines.node;
    if (!semver.satisfies(process.version, packageConfig.engines.node)) {
        return console.log(chalk.red(
            '  请升级node版本 >=' + packageConfig.engines.node + '.x'
        ))
    }
    done()
}