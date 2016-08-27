var Stack = require("../Stack"),
    cache = require("../utility/cache");

module.exports = function () {

    Error.captureStackTrace = function (error, toFunction) {
        Object.defineProperties(error, {
            stack: {
                configurable: true,
                get: cache(function () {
                    return new (error.constructor.Stack || Stack)(error, []);
                })
            }
        });
    };

    Error.getStackTrace = function (error) {
        if (error.stack instanceof Stack)
            return error.stack;
        var stack = new Stack(error, []);
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