const path = require('path');

module.exports = {
    // cache path for storing modules like cmd/scaffold
    cacheFolder: path.join(process.env.HOME, '.cache'),
};
