const chalk = require('chalk')
const format = require('util').format

/**
 * Prefix.
 */
const prefix = '   build-cli'
const sep = chalk.gray('·')

/**
 * Log.
 * @param {String} message
 */
exports.log = function (...args) {
    const msg = format.apply(format, args)
    console.log(chalk.white(prefix), sep, msg)
}

/**
 * 输出失败信息.
 * @param {String} message
 */

exports.fatal = function (...args) {
    if (args[0] instanceof Error) args[0] = args[0].message.trim()
    const msg = format.apply(format, args)
    console.error(chalk.red(prefix), sep, msg)
    process.exit(1)
}

/**
 * 输出成功信息.
 * @param {String} message
 */

exports.success = function (...args) {
    const msg = format.apply(format, args)
    console.log(chalk.white(prefix), sep, msg)
}