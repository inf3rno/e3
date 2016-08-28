var Stack = require("../Stack"),
    cache = require("../utility/cache"),
    prepareStackTrace = require("./prepareStackTrace");

module.exports = function () {

    Error.captureStackTrace = function (error, toFunction) {
        Object.defineProperties(error, {
            stack: {
                configurable: true,
                get: cache(function () {
                    return (Error.prepareStackTrace || prepareStackTrace)(error, []);
                })
            }
        });
    };

    Error.getStackTrace = function (error) {
        if (error.stack instanceof Stack)
            return error.stack;
        var stack = (Error.prepareStackTrace || prepareStackTrace)(error, []);
        try {
            Object.defineProperties(error, {
                stack: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: stack
                }
            });
        } catch (nonConfigurableError) {
        }
        return stack;
    };

};