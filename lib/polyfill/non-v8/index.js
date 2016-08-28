var Stack = require("../../Stack"),
    FrameStringSource = require("./FrameStringSource"),
    FrameStringParser = require("./FrameStringParser"),
    cache = require("../../utility/cache"),
    prepareStackTrace = require("../prepareStackTrace");

module.exports = function () {

    Error.captureStackTrace = function captureStackTrace(error, toFunction) {
        var comments;
        var captured = FrameStringSource.getInstance().captureFrameStrings([
            captureStackTrace,
            // <- additional frames shouldn't be here, since we have no means to detect them in strict mode
            // adding comments about this will more or less solve the problem
            // we could add an UKNOWN_FRAMES constant here, but that would make this harder to process
            toFunction
        ]);
        Object.defineProperties(error, {
            stack: {
                configurable: true,
                get: cache(function () {
                    var frames = FrameStringParser.getInstance().getFrames(captured.frameStrings, captured.functionValues);
                    return (Error.prepareStackTrace || prepareStackTrace)(error, frames, comments);
                })
            }
        });
    };

    Error.getStackTrace = function (error) {
        if (error.stack instanceof Stack)
            return error.stack;
        var frameStrings = FrameStringSource.getInstance().getFrameStrings(error),
            frames = [],
            comments;
        if (frameStrings)
            frames = FrameStringParser.getInstance().getFrames(frameStrings, []);
        else
            comments = [
                "The stack is not readable by unthrown errors in this environment."
            ];
        var stack = (Error.prepareStackTrace || prepareStackTrace)(error, frames, comments);
        if (frameStrings)
            try {
                Object.defineProperties(error, {
                    stack: {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: stack
                    }
                });
            } catch (nonConfigurableError) {
            }
        return stack;
    };

};