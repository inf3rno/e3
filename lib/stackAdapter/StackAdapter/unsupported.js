var Class = require("o3").Class,
    Stack = require("../../Stack"),
    cache = require("../../utility/cache");

var StackAdapter = Class(Object, {
    prototype: {
        presentStack: function (error, toFunction) {
            Object.defineProperties(error, {
                stack: {
                    configurable: true,
                    get: cache(function () {
                        return new (error.constructor.Stack || Stack)(error, []);
                    })
                }
            });
        },
        pastStack: function (wrapper, error) {
            Object.defineProperties(wrapper, {
                stack: {
                    configurable: true,
                    get: cache(function () {
                        return new Stack(error, []);
                    })
                }
            });
        }
    }
});

module.exports = StackAdapter;