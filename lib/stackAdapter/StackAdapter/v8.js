var Class = require("o3").Class,
    Stack = require("../../Stack");

var StackAdapter = Class(Object, {
    prototype: {
        constructor: function () {
            Error.prepareStackTrace = function (error, frames) {
                return new (error.constructor.Stack || Stack)(error, frames);
            };
        },
        presentStack: function (error, fn) {
            Error.captureStackTrace(error, fn);
        },
        pastStack: function (error) {
        }
    }
});

module.exports = StackAdapter;