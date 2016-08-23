var Class = require("o3").Class,
    Stack = require("../../Stack");

var StackAdapter = Class(Object, {
    prototype: {
        presentStack: function (error, toFunction) {
            var stack = new (error.constructor.Stack || Stack)(error, []);
            return function () {
                return stack;
            };
        },
        pastStack: function (error) {
            var stack = new Stack(error, []);
            return function () {
                return stack;
            };
        }
    }
});

module.exports = StackAdapter;