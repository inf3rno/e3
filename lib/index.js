require("error-polyfill");

var Stack = require("./Stack");

Object.defineProperties(Error, {
    prepareStackTrace: {
        configurable: false,
        writable: false,
        value: function (throwable, frames, warnings) {
            if (throwable instanceof Error)
                return new (throwable.constructor.Stack || Stack)(throwable, frames, warnings);
            else
                return new Stack(throwable, frames, warnings);
        }
    }
});

module.exports = {
    UserError: require("./UserError"),
    CompositeError: require("./CompositeError"),
    Stack: Stack,
    CompositeStack: require("./CompositeStack")
};