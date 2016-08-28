require("./polyfill");

var Stack = require("./Stack");

Object.defineProperties(Error, {
    prepareStackTrace: {
        configurable: false,
        writable: false,
        value: function (throwable, frames, comments) {
            if (throwable instanceof Error)
                return new (throwable.constructor.Stack || Stack)(throwable, frames, comments);
            else
                return new Stack(throwable, frames, comments);
        }
    }
});

module.exports = {
    UserError: require("./UserError"),
    CompositeError: require("./CompositeError"),
    NativeError: require("./NativeError"),
    Stack: Stack,
    CompositeStack: require("./CompositeStack")
};