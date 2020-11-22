const chalk = require('chalk')


/**
 * 执行metajs中filter的js语法
 * @param {*} exp key
 * @param {*} data meta的字段 比如filter 
 * @returns {boolean} data.key
 */
module.exports = function evaluate(exp, data) {
    /* eslint-disable no-new-func */
    const fn = new Function('data', 'with (data) { return ' + exp + '}')
    try {
        return fn(data)
    } catch (e) {
        console.error(chalk.red('Error when evaluating filter condition: ' + exp))
    }
}