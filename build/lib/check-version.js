"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var package_json_1 = __importDefault(require("../package.json"));
var semver_1 = __importDefault(require("semver"));
exports.default = (function (done) {
    var requiredVersion = package_json_1.default.engines.node;
    if (!semver_1.default.satisfies(process.version, requiredVersion)) {
        return console.log(chalk_1.default.red("  请升级node版本 >=" + requiredVersion + ".x"));
    }
    done();
});
