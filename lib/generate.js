const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const render = require('ejs').render
const async = require('async')
const path = require('path')
const multimatch = require('multimatch')
const getOptions = require('./options')
const ask = require('./ask')
const filter = require('./filter')
const logger = require('./logger')
const exists = require('fs').existsSync
const glob = require('glob')
const rm = require('rimraf').sync
const fs = require('fs')
const _ = require('lodash')
/**
 * 生成文件, src to dest
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

module.exports = function generate(name, src, dest, done) {
    // 删除原来项目中webpack.config.js
    // glob(`${dest}/webpack.*.js`, (err, files) => {
    //     files.forEach(item => rm(item))
    // });
    const opts = getOptions(name, src)
    const metalsmith = Metalsmith(path.join(src, 'templates'))
    const data = Object.assign(metalsmith.metadata(), {
        destDirName: name,
        inPlace: dest === process.cwd(),
        noEscape: true
    })
    // 执行中间件
    metalsmith
        .use(askQuestions(opts.prompts))
        .use(filterFiles(opts.filters))
        .use(renderTemplateFiles(opts.skipInterpolation, dest))
    // 执行文件操作
    metalsmith
        .clean(false)
        .source('.')
        .destination(dest)
        .build((err, files) => {
            done(err)
            if (typeof opts.complete === 'function') {
                const helpers = { chalk, logger, files }
                opts.complete(data, helpers)
            } else {
                logMessage(opts.completeMessage, data)
            }
        })
    return data
}

/**
 * 询问中间件
 * @param {Object} prompts
 * @return {Function}
 */

function askQuestions(prompts) {
    return (files, metalsmith, done) => {
        ask(prompts, metalsmith.metadata(), done)
    }
}


/**
 * 过滤文件中间件.
 * @param {Object} filters
 * @return {Function}
 */

function filterFiles(filters) {
    return (files, metalsmith, done) => {
        filter(files, filters, metalsmith.metadata(), done)
    }
}

/**
 * 渲染tpl中间件.
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function renderTemplateFiles(skipInterpolation, dest) {
    skipInterpolation = typeof skipInterpolation === 'string'
        ? [skipInterpolation]
        : skipInterpolation
    return (files, metalsmith, done) => {
        const keys = Object.keys(files)
        const metalsmithMetadata = metalsmith.metadata()
        async.each(keys, (file, next) => {
            // skipping files with skipInterpolation option
            if (skipInterpolation && multimatch([file], skipInterpolation, { dot: true }).length) {
                return next()
            }
            const str = files[file].contents.toString()
            // do not attempt to render files that do not have mustaches
            if (!/<%[^%>]+%>/g.test(str)) {
                return next()
            }
            let res = render(str, metalsmithMetadata)

            const oldpkgPath = path.join(dest, 'package.json');
            if (file === 'package.json' && exists(oldpkgPath)) {
                const oldpkgContent = JSON.parse(fs.readFileSync(oldpkgPath, 'utf-8'));
                const pkgContent = JSON.parse(res);
                res = JSON.stringify(_.merge(oldpkgContent, pkgContent), null, '\t');
            }
            files[file].contents = Buffer.from(res)
            next()
        }, done)
    }
}

/**
 * 渲染tpl完成之后的输出信息.
 * @param {String} message
 * @param {Object} data
 */

function logMessage(message, data) {
    if (!message) return
    render(message, data, (err, res) => {
        if (err) {
            console.error('\n   Error when rendering template complete message: ' + err.message.trim())
        } else {
            console.log('\n' + res.split(/\r?\n/g).map(line => '   ' + line).join('\n'))
        }
    })
}