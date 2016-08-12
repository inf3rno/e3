var Class = require("o3").Class;

var ThrowingStackStringGenerator = Class(Object, {
    prototype: {
        constructor: function () {
        },
        generateStackString: function () {
            try {
                throw new Error();
            } catch (error) {
                return String(error.stack);
            }
        }
    }
});

module.exports = ThrowingStackStringGenerator;