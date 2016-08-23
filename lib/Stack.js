var Class = require("o3").Class;

var Stack = Class.extend({
    prototype: {
        error: null,
        frames: null,
        init: function (error, frames) {
            if (!(error instanceof Error))
                throw new Error("The error argument must be an Error instance.");
            if (!(frames instanceof Array))
                throw new Error("The frames argument must be an Array instance.");
            this.error = error;
            this.frames = frames;
        },
        toString: function () {
            var string = "";
            string += this.error.name;
            string += ": " + this.error.message;
            for (var i in this.frames) {
                var frame = this.frames[i];
                string += "\n" + frame;
            }
            return string;
        }
    }
});

module.exports = Stack;