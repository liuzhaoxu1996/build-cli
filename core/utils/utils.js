// const webpack = {
//     entry: '';
// }
const dev = require('../../cache/webpack.dev.js');
const prod = require('../../cache/webpack.prod.js');
const config = require('../config/config.js');

module.exports = {
    // 添加配置 
    addPlugin: (value) => {
        return this.add('plugins', value);
    },
    addLoader: (value) => {
        return this.add('module', value);
    },
    add: (field, config) => {
        [dev, prod].map(item => {
            const name = item[field];
            if (typeof (name) === 'object') {
                if (Array.isArray(name)) {
                    name.push(config);
                } else {
                    name = Object.assign({}, name, config);
                }
            } else {
                name = config;
            }
        })
    },

}