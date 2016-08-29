var Stack = require("./Stack");

var CompositeStack = Stack.extend({
    prototype: {
        toString: function (key) {
            var string = Stack.prototype.toString.call(this);
            var prefix = "";
            if (typeof (key) == "string")
                prefix = key + ".";
            for (var property in this.throwable) {
                var value = this.throwable[property];
                if (!(value instanceof Error))
                    continue;
                string += "\ncaused by <" + prefix + property + "> ";
                var stack = Error.getStackTrace(value);
                if (stack instanceof CompositeStack)
                    string += stack.toString(prefix + property);
                else
                    string += stack.toString();
            }
            return string;
        }
    }
});

module.exports = CompositeStack;