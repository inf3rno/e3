var prepareStackTrace = function (throwable, frames, comments) {
    var string = "";
    string += throwable.name || "Error";
    string += ": " + (throwable.message || "");
    if (comments instanceof Array)
        for (var commentIndex in comments) {
            var comment = comments[commentIndex];
            string += "\n   # " + comment;
        }
    for (var frameIndex in frames) {
        var frame = frames[frameIndex];
        string += "\n   at " + frame.toString();
    }
    return string;
};

module.exports = prepareStackTrace;