var capability = require("capability");

var StackAdapter;

if (capability("Error.captureStackTrace"))
    StackAdapter = require("./v8");
else if (capability("Error.prototype.stack") && capability("arguments.callee.caller"))
    StackAdapter = require("./non-v8");
else
    StackAdapter = require("./unsupported");

module.exports = StackAdapter;