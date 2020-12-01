"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var metalsmith_1 = __importDefault(require("metalsmith"));
var multimatch_1 = __importDefault(require("multimatch"));
var options_1 = __importDefault(require("./options"));
var ask_1 = __importDefault(require("./ask"));
var filter_1 = __importDefault(require("./filter"));
var ejs_1 = require("ejs");
var log_1 = require("./log");
var fs_1 = require("fs");
var fs_2 = __importDefault(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
var async_1 = __importDefault(require("async"));
function generate(name, src, dest, done) {
    var opts = options_1.default(name, src);
    var metalsmith = metalsmith_1.default(path_1.default.join(src, "templates"));
    var data = Object.assign(metalsmith.metadata(), {
        destDirName: name,
        inPlace: dest === process.cwd(),
        noEscape: true,
    });
    metalsmith
        .use(askQuestions(opts.prompts))
        .use(filterFiles(opts.filters))
        .use(renderTemplateFiles(opts.skipInterpolation, dest));
    metalsmith
        .clean(false)
        .source(".")
        .destination(dest)
        .build(function (err, files) {
        done(err);
        if (typeof opts.complete === "function") {
            var helpers = { chalk: chalk_1.default, log: log_1.log, files: files };
            opts.complete(data, helpers);
        }
        else {
            logMessage(opts.completeMessage, data);
        }
    });
    return data;
}
exports.default = generate;
function askQuestions(prompts) {
    return function (files, metalsmith, done) {
        ask_1.default(prompts, metalsmith.metadata(), done);
    };
}
function filterFiles(filters) {
    return function (files, metalsmith, done) {
        filter_1.default(files, filters, metalsmith.metadata(), done);
    };
}
function renderTemplateFiles(skipInterpolation, dest) {
    skipInterpolation =
        typeof skipInterpolation === "string"
            ? [skipInterpolation]
            : skipInterpolation;
    return function (files, metalsmith, done) {
        var keys = Object.keys(files);
        var metalsmithMetadata = metalsmith.metadata();
        async_1.default.each(keys, function (file, next) {
            if (skipInterpolation &&
                multimatch_1.default([file], skipInterpolation, { dot: true }).length) {
                return next();
            }
            var str = files[file].contents.toString();
            if (!/<%[^%>]+%>/g.test(str)) {
                return next();
            }
            var res = ejs_1.render(str, metalsmithMetadata);
            var oldpkgPath = path_1.default.join(dest, "package.json");
            if (file === "package.json" && fs_1.existsSync(oldpkgPath)) {
                var oldpkgContent = JSON.parse(fs_2.default.readFileSync(oldpkgPath, "utf-8"));
                var pkgContent = JSON.parse(res);
                res = JSON.stringify(lodash_1.default.merge(oldpkgContent, pkgContent), null, "\t");
            }
            files[file].contents = Buffer.from(res);
            next();
        }, done);
    };
}
function logMessage(message, data) {
    if (!message)
        return;
    ejs_1.render(message, data, function (err, res) {
        if (err) {
            console.error("\n   模板编译失败: " + err.message.trim());
        }
        else {
            console.log("\n" +
                res
                    .split(/\r?\n/g)
                    .map(function (line) { return "   " + line; })
                    .join("\n"));
        }
    });
}
