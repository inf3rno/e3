var Class = require("o3").Class;

var Stack = Class.extend({
    prototype: {
        throwable: null,
        frames: null,
        init: function (throwable, frames) {
            if (!(throwable instanceof Object))
                throw new Error("The throwable argument must be an Object instance.");
            if (!(frames instanceof Array))
                throw new Error("The frames argument must be an Array instance.");
            this.throwable = throwable;
            this.frames = frames;
        },
        toString: function () {
            var string = "";
            string += this.throwable.name || "Error";
            string += ": " + (this.throwable.message || "");
            for (var index in this.frames) {
                var frame = this.frames[index];
                string += "\n" + frame;
            }
            return string;
        }
    }
});

module.exports = Stack;