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
 * Generate a template given a `src` and `dest`.
 *
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

module.exports = function generate(name, src, dest, done) {
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
    metalsmith.use(askQuestions(opts.prompts))
        .use(filterFiles(opts.filters))
        .use(renderTemplateFiles(opts.skipInterpolation, dest))
    metalsmith.clean(false)
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
 * Create a middleware for asking questions.
 *
 * @param {Object} prompts
 * @return {Function}
 */

function askQuestions(prompts) {
    return (files, metalsmith, done) => {
        ask(prompts, metalsmith.metadata(), done)
    }
}


/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */

function filterFiles(filters) {
    return (files, metalsmith, done) => {
        filter(files, filters, metalsmith.metadata(), done)
    }
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function renderTemplateFiles(skipInterpolation, dest) {
    skipInterpolation = typeof skipInterpolation === 'string'
        ? [skipInterpolation]
        : skipInterpolation
    return (files, metalsmith, done) => {
        console.log(files, metalsmith)
        const keys = Object.keys(files)
        const metalsmithMetadata = metalsmith.metadata()
        async.each(keys, (file, next) => {
            // skipping files with skipInterpolation option
            if (skipInterpolation && multimatch([file], skipInterpolation, { dot: true }).length) {
                return next()
            }
            let str = files[file].contents.toString()
            // do not attempt to render files that do not have mustaches
            if (!/<%[^%>]+%>/g.test(str)) {
                return next()
            }

            const oldpkgPath = path.join(dest, 'package.json');
            if (file === 'package.json' && exists(oldpkgPath)) {
                const oldpkgContent = JSON.parse(fs.readFileSync(oldpkgPath, 'utf-8'));
                const pkgContent = JSON.parse(str);
                str = JSON.stringify(_.merge(oldpkgContent, pkgContent), null, '\t');
            }
            const res = render(str, metalsmithMetadata)
            files[file].contents = Buffer.from(res)
            next()
        }, done)
    }
}

/**
 * Display template complete message.
 *
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