var Class = require("o3").Class,
    ShiftedFrameExtractor = require("./ShiftedFrameExtractor"),
    ThrowingStackStringGenerator = require("./ThrowingStackStringGenerator"),
    StackStringParser = require("./StackStringParser");

module.exports = Class(ShiftedFrameExtractor, {
    prototype: {
        stackStringGenerator: new ThrowingStackStringGenerator(),
        stackStringParser: new StackStringParser({
            stackParser: function (stackString, parseFrameStrings) {
                var frameStrings = stackString.split("\n");
                return parseFrameStrings(frameStrings);
            },
            frameParser: function () {
            }
        })
    }
});