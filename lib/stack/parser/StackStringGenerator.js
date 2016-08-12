var Class = require("o3").Class;

var StackStringGenerator = Class(Object, {
    prototype: {
        constructor: function () {
        },
        generateStackString: function () {
            return String(new Error().stack);
        }
    }
});

module.exports = StackStringGenerator;