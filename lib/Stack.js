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

module.exports = Stack;