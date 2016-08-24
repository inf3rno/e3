var Class = require("o3").Class,
    Stack = require("./Stack"),
    stackAdapter = require("./stackAdapter");

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
                    configurable: false,
                    get: stackAdapter.pastStack(error) || function () {
                        return error.stack;
                    }
                }
            });
        }
    }
});

module.exports = NativeError;