"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var read_metadata_1 = __importDefault(require("read-metadata"));
var fs_1 = require("fs");
var git_user_1 = __importDefault(require("./git-user"));
var validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
function options(name, dir) {
    var opts = getMetadata(dir);
    setDefault(opts, "name", name);
    setValidateName(opts);
    var author = git_user_1.default();
    if (author) {
        setDefault(opts, "author", author);
    }
    return opts;
}
exports.default = options;
function getMetadata(dir) {
    var json = path_1.default.join(dir, "meta.json");
    var js = path_1.default.join(dir, "meta.js");
    var opts = {};
    if (fs_1.existsSync(json)) {
        opts = read_metadata_1.default.sync(json);
    }
    else if (fs_1.existsSync(js)) {
        var req = require(path_1.default.resolve(js));
        if (req !== Object(req)) {
            throw new Error("meta.js 需要返回一个object");
        }
        opts = req;
    }
    return opts;
}
function setDefault(opts, key, val) {
    if (opts.schema) {
        opts.prompts = opts.schema;
        delete opts.schema;
    }
    var prompts = opts.prompts || (opts.prompts = {});
    if (!prompts[key] || typeof prompts[key] !== "object") {
        prompts[key] = {
            type: "string",
            default: val,
        };
    }
    else {
        prompts[key]["default"] = val;
    }
}
function setValidateName(opts) {
    var name = opts.prompts.name;
    var customValidate = name.validate;
    name.validate = function (name) {
        var its = validate_npm_package_name_1.default(name);
        if (!its.validForNewPackages) {
            var errors = ((its && its.errors) || []).concat(its.warnings || []);
            return "Sorry, " + errors.join(" and ") + ".";
        }
        if (typeof customValidate === "function")
            return customValidate(name);
        return true;
    };
}
