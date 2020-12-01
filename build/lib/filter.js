"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var minimatch_1 = __importDefault(require("minimatch"));
var eval_1 = __importDefault(require("./eval"));
exports.default = (function (files, filters, data, done) {
    if (!filters) {
        return done();
    }
    var fileNames = Object.keys(files);
    Object.keys(filters).forEach(function (glob) {
        fileNames.forEach(function (file) {
            if (minimatch_1.default(file, glob, { dot: true })) {
                var condition = filters[glob];
                if (!eval_1.default(condition, data)) {
                    delete files[file];
                }
            }
        });
    });
    done();
});
