var Stack = require("../Stack");

module.exports = function () {

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

    Error.getStackTrace = function (error) {
        return error.stack;
    };

};