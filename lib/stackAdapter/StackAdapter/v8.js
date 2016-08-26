var Class = require("o3").Class,
    Stack = require("../../Stack"),
    cache = require("../../utility/cache");

var StackAdapter = Class(Object, {
    prototype: {
        constructor: function () {
            Object.defineProperties(Error, {
                prepareStackTrace: {
                    configurable: false,
                    writable: false,
                    value: function (throwable, frames) {
                        if (throwable instanceof Error)
                            return new (throwable.constructor.Stack || Stack)(throwable, frames);
                        else
                            return new Stack(throwable, frames);
                    }
                }
            });
        },
        presentStack: function (error, toFunction) {
            Error.captureStackTrace(error, toFunction);
        },
        pastStack: function (wrapper, error) {
            Object.defineProperties(wrapper, {
                stack: {
                    configurable: true,
                    get: cache(function () {
                        return error.stack;
                    })
                }
            });
        }
    }
});

module.exports = StackAdapter;