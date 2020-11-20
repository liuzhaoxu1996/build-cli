const ora = require('ora');

let globalSpinner = ora();

// globalSpinner.hideCursor();

module.exports = {
    start(content) {
        return globalSpinner.start(`${'[deft]'.green} ${content}`);
    },
    succeed(content) {
        return globalSpinner.succeed(`${'[deft]'.green} ${content}`);
    },
    warn(content) {
        return globalSpinner.succeed(`${'[deft]'.yellow} ${content}`);
    },
    fail(content) {
        return globalSpinner.fail(`${'[deft]'.red} ${content}`);
    },
    stop() {
        return globalSpinner.stop();
    },
    clear() {
        return globalSpinner.clear();
    },
    logWhite() {
        const args = Array.prototype.slice.apply(arguments);
        console.log('[deft]', ...args);
    },
    logGreen() {
        const args = Array.prototype.slice.apply(arguments);
        console.log('[deft]'.green, ...args);
    },
    logYellow() {
        const args = Array.prototype.slice.apply(arguments);
        console.log('[deft]'.yellow, ...args);
    },
    logRed() {
        const args = Array.prototype.slice.apply(arguments);
        console.log('[deft]'.red, ...args);
    },
    getGlobalSpinner() {
        return globalSpinner;
    },
};
