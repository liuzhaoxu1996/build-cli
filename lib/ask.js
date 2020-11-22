const async = require('async')
const inquirer = require('inquirer')
const evaluate = require('./eval')

const promptMapping = {
    string: 'input',
    boolean: 'confirm'
}

/**
 * 询问
 * @param {*} prompts 来自meta.js配置的问题列表
 * @param {*} data 用户选择后的数据
 * @param {*} done 回调
 */
module.exports = function ask(prompts, data, done) {
    async.eachSeries(Object.keys(prompts), (key, next) => {
        prompt(data, key, prompts[key], next)
    }, done)
}

/**
 * 询问主体, 并优化inquirer返回的数据
 *
 * @param {Object} data 问题的value
 * @param {String} key 问题对象的key
 * @param {Object} prompt 问题对象
 * @param {Function} done 回调
 */

function prompt(data, key, prompt, done) {
    // 测试预留钩子,可以过滤问答环节
    if (prompt.when && !evaluate(prompt.when, data)) {
        return done()
    }

    // 设置默认值, 如果是函数,就执行
    let promptDefault = prompt.default;
    if (typeof prompt.default === 'function') {
        promptDefault = function () {
            return prompt.default.bind(this)(data)
        }
    }

    // inquirer
    inquirer.prompt([{
        type: promptMapping[prompt.type] || prompt.type,
        name: key,
        message: prompt.message || prompt.label || key,
        default: promptDefault,
        choices: prompt.choices || [],
        validate: prompt.validate || (() => true)
    }]).then(answers => {
        if (Array.isArray(answers[key])) {
            data[key] = {}
            answers[key].forEach(multiChoiceAnswer => {
                data[key][multiChoiceAnswer] = true
            })
        } else if (typeof answers[key] === 'string') {
            // 转义字符串,并兼容windows写法
            data[key] = answers[key].replace(/"/g, '\\"')
        } else {
            data[key] = answers[key]
        }
        done()
    }).catch(done)
}