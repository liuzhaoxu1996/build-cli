const match = require('minimatch')
const evaluate = require('./eval')

/**
 * 过滤metajs中filter配置的文件
 * @param {*} files 文件
 * @param {*} filters 过滤文件列表
 * @param {*} data metadata
 * @param {*} done 
 */
module.exports = (files, filters, data, done) => {
    if (!filters) {
        return done()
    }
    const fileNames = Object.keys(files)
    Object.keys(filters).forEach(glob => {
        fileNames.forEach(file => {
            if (match(file, glob, { dot: true })) {
                const condition = filters[glob]
                if (!evaluate(condition, data)) {
                    delete files[file]
                }
            }
        })
    })
    done()
}