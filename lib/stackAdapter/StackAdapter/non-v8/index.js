var Class = require("o3").Class,
    Stack = require("../../../Stack"),
    FrameStringSource = require("./FrameStringSource"),
    FrameStringParser = require("./FrameStringParser"),
    cache = require("../../../utility/cache"),
    Frame = require("./Frame");

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
                            frames;
                        if (frameStrings)
                            frames = this.frameStringParser.getFrames(frameStrings, []);
                        else
                            frames = [
                                new Frame({
                                    frameString: "The stack is not readable by unthrown errors in this environment."
                                })
                            ];
                        return new Stack(error, frames);
                    }.bind(this))
                }
            });
        }
    }
});


module.exports = StackAdapter;