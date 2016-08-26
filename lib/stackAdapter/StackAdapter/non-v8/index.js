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
            var captured = this.frameStringSource.captureFrameStrings([
                this.presentStack,
                // <- additional frames shouldn't be here, since we have no means to detect them in strict mode
                // adding comments about this will more or less solve the problem
                toFunction
            ]);
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
                        var frameStrings = this.frameStringSource.getFrameStrings(error),
                            frames = [],
                            comments;
                        if (frameStrings)
                            frames = this.frameStringParser.getFrames(frameStrings, []);
                        else
                            comments = [
                                "The stack is not readable by unthrown errors in this environment."
                            ];
                        return new Stack(error, frames, comments);
                    }.bind(this))
                }
            });
        }
    }
});


module.exports = StackAdapter;