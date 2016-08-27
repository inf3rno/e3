var Stack = require("./Stack"),
    NativeError = require("./NativeError");

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

                if (!(value.stack instanceof Stack))
                    value = new NativeError(value);
                if (value.stack instanceof CompositeStack)
                    string += value.stack.toString(prefix + property);
                else
                    string += value.stack.toString();
            }
            return string;
        }
    }
});

module.exports = CompositeStack;