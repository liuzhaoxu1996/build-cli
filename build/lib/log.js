"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.fatal = exports.log = void 0;
var chalk_1 = __importDefault(require("chalk"));
var util_1 = require("util");
var prefix = "   so-build-cli";
var sep = chalk_1.default.gray("·");
var log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var msg = util_1.format.apply(util_1.format, args);
    console.log(chalk_1.default.white(prefix), sep, msg);
};
exports.log = log;
var fatal = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args[0] instanceof Error)
        args[0] = args[0].message.trim();
    var msg = util_1.format.apply(util_1.format, args);
    console.error(chalk_1.default.red(prefix), sep, msg);
    process.exit(1);
};
exports.fatal = fatal;
var success = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var msg = util_1.format.apply(util_1.format, args);
    console.log(chalk_1.default.white(prefix), sep, msg);
};
exports.success = success;
