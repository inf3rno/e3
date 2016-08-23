var Class = require("o3").Class,
    Stack = require("../../../Stack"),
    FrameStringSource = require("./FrameStringSource"),
    FrameStringParser = require("./FrameStringParser");

var StackAdapter = Class(Object, {
    prototype: {
        constructor: function () {
            this.frameStringSource = new (FrameStringSource.getClass())();
            this.frameStringParser = new (FrameStringParser.getClass())();
        },
        presentStack: function (error, toFunction) {
            var results = this.frameStringSource.captureFrameStrings(toFunction);
            var frames = this.frameStringParser.getFrames(results.frameStrings, results.functionValues);
            var stack = new (error.constructor.Stack || Stack)(error, frames);
            return function () {
                return stack;
            };
        },
        pastStack: function (error) {
            var frameStrings = this.frameStringSource.getFrameStrings(error);
            var frames = this.frameStringParser.getFrames(frameStrings, []);
            var stack = new Stack(error, frames);
            return function () {
                return stack;
            };
        }
    }
});


module.exports = StackAdapter;