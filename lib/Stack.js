var Class = require("o3").Class,
    prepareStackTrace = require("error-polyfill").prepareStackTrace;

var Stack = Class.extend({
    prototype: {
        throwable: null,
        frames: null,
        warnings: null,
        init: function (throwable, frames, warnings) {
            this.throwable = throwable;
            this.frames = frames;
            this.warnings = warnings;
        },
        toString: function () {
            return prepareStackTrace(this.throwable, this.frames, this.warnings);
        }
    }
});

var extractStringMethods = function () {
    var stringMethods = {};
    var names = Object.getOwnPropertyNames(String.prototype);

    for (var index in names) {
        var name = names[index];
        if (name == "valueOf" || name == "toString")
            continue;
        var method = String.prototype[name];
        if (!(method instanceof Function))
            continue;
        stringMethods[name] = method;
    }
    return stringMethods;
};

Stack.prototype.absorb(extractStringMethods());

module.exports = Stack;