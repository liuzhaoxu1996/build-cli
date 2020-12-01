"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eval_1 = __importDefault(require("./eval"));
var inquirer_1 = __importDefault(require("inquirer"));
var async_1 = __importDefault(require("async"));
function ask(prompts, data, done) {
    async_1.default.eachSeries(Object.keys(prompts), function (key, next) {
        prompt(data, key, prompts[key], next);
    }, done);
}
exports.default = ask;
function prompt(data, key, prompt, done) {
    if (prompt.when && !eval_1.default(prompt.when, data)) {
        return done();
    }
    var promptDefault = prompt.default;
    if (typeof prompt.default === "function") {
        promptDefault = function () {
            return prompt.default.bind(this)(data);
        };
    }
    inquirer_1.default
        .prompt([
        {
            type: prompt.type,
            name: key,
            message: prompt.message || prompt.label || key,
            default: promptDefault,
            choices: prompt.choices || [],
            validate: prompt.validate || (function () { return true; }),
        },
    ])
        .then(function (answers) {
        if (Array.isArray(answers[key])) {
            data[key] = {};
            answers[key].forEach(function (multiChoiceAnswer) {
                data[key][multiChoiceAnswer] = true;
            });
        }
        else if (typeof answers[key] === "string") {
            data[key] = answers[key].replace(/"/g, '\\"');
        }
        else {
            data[key] = answers[key];
        }
        done();
    })
        .catch(done);
}
