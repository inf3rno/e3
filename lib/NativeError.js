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
            stackAdapter.pastStack(this, error);
        }
    }
});

module.exports = NativeError;