var Class = require("o3").Class,
    prepareStackTrace = require("./polyfill/prepareStackTrace");

var Stack = Class.extend({
    prototype: {
        throwable: null,
        frames: null,
        comments: [],
        init: function (throwable, frames, comments) {
            if (!(throwable instanceof Object))
                throw new Error("The throwable argument must be an Object instance.");
            this.throwable = throwable;
            if (!(frames instanceof Array))
                throw new Error("The frames argument must be an Array instance.");
            this.frames = frames;
            if (comments) {
                if (!(comments instanceof Array))
                    throw new Error("The stack comments must be strings in an Array.");
                this.comments = comments;
            }
        },
        toString: function () {
            return prepareStackTrace(this.throwable, this.frames, this.comments);
        }
    }
});

module.exports = Stack;