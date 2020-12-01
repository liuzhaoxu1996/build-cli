"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
exports.default = {
    isLocalPath: function (templatePath) {
        return /^[./]|(^[a-zA-Z]:)/.test(templatePath);
    },
    getTemplatePath: function (templatePath) {
        return path_1.default.isAbsolute(templatePath)
            ? templatePath
            : path_1.default.normalize(path_1.default.join(process.cwd(), templatePath));
    },
};
