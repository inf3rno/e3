var Class = require("o3").Class,
    Stack = require("./Stack");

var NativeError = Class(Error, {
    factory: Class.factory,
    stack: Stack,
    prototype: {
        name: "NativeError",
        init: function (error) {
            this.name = error.name;
            this.message = error.message;
            Object.defineProperties(this, {
                stack: {
                    configurable: true,
                    get: function () {
                        return Error.getStackTrace(error);
                    }
                }
            });
        }
    }
});
Class.absorb.call(NativeError, Class);

module.exports = NativeError;