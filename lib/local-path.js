const path = require('path')

module.exports = {
    /**
     * 查看是否是本地路径
     * @param {*} templatePath path
     */
    isLocalPath(templatePath) {
        return /^[./]|(^[a-zA-Z]:)/.test(templatePath)
    },

    /**
     * 格式化路径
     * @param {*} templatePath path
     */
    getTemplatePath(templatePath) {
        return path.isAbsolute(templatePath)
            ? templatePath
            : path.normalize(path.join(process.cwd(), templatePath))
    }
}