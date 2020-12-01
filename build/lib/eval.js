"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
function evaluate(exp, data) {
    var fn = new Function("data", "with (data) { return " + exp + "}");
    try {
        return fn(data);
    }
    catch (e) {
        console.error(chalk_1.default.red("Error when evaluating filter condition: " + exp));
    }
}
exports.default = evaluate;
