module.exports = function () {
    Error.getStackTrace = function (error) {
        return error.stack;
    };
};