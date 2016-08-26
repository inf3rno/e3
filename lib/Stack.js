var Class = require("o3").Class;

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
            var string = "";
            string += this.throwable.name || "Error";
            string += ": " + (this.throwable.message || "");
            for (var commentIndex in this.comments) {
                var comment = this.comments[commentIndex];
                string += "\n   # " + comment;
            }
            for (var frameIndex in this.frames) {
                var frame = this.frames[frameIndex];
                string += "\n" + frame;
            }
            return string;
        }
    }
});

module.exports = Stack;