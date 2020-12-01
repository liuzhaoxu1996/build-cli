"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
exports.default = (function () {
    var name;
    var email;
    try {
        name = child_process_1.execSync("git config --get user.name");
        email = child_process_1.execSync("git config --get user.email");
    }
    catch (e) { }
    name = name && JSON.stringify(name.toString().trim()).slice(1, -1);
    email = email && " <" + email.toString().trim() + ">";
    return (name || "") + (email || "");
});
