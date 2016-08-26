var Class = require("o3").Class,
    Stack = require("../../../Stack"),
    FrameStringSource = require("./FrameStringSource"),
    FrameStringParser = require("./FrameStringParser"),
    cache = require("../../../utility/cache");

var StackAdapter = Class(Object, {
    prototype: {
        constructor: function () {
            this.frameStringSource = new (FrameStringSource.getClass())();
            this.frameStringParser = new (FrameStringParser.getClass())();
        },
        presentStack: function (error, toFunction) {
            var captured = this.frameStringSource.captureFrameStrings(toFunction);
            Object.defineProperties(error, {
                stack: {
                    configurable: true,
                    get: cache(function () {
                        var frames = this.frameStringParser.getFrames(captured.frameStrings, captured.functionValues);
                        return new (error.constructor.Stack || Stack)(error, frames);
                    }.bind(this))
                }
            });
        },
        pastStack: function (wrapper, error) {
            Object.defineProperties(wrapper, {
                stack: {
                    configurable: true,
                    get: cache(function () {
                        var frameStrings = this.frameStringSource.getFrameStrings(error);
                        var frames = this.frameStringParser.getFrames(frameStrings, []);
                        return new Stack(error, frames);
                    }.bind(this))
                }
            });
        }
    }
});


module.exports = StackAdapter;