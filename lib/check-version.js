const request = require('request')
const semver = require('semver')
const chalk = require('chalk')
const packageConfig = require('../package.json')

module.exports = done => {
    // 判断node和npm版本
    if (!semver.satisfies(process.version, packageConfig.engines.node)) {
        return console.log(chalk.red(
            '  You must upgrade node to >=' + packageConfig.engines.node + '.x to use sobuild-cli'
        ))
    }
    done()
}