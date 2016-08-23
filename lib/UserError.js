var Class = require("o3").Class,
    Stack = require("./Stack"),
    stackAdapter = require("./stackAdapter");

var UserError = Class(Error, {
    factory: function () {
        return function () {
            var instance = this;
            var getStack = stackAdapter.presentStack(instance, arguments.callee);
            if (getStack)
                Object.defineProperties(instance, {
                    stack: {get: getStack}
                });
            if (instance.build instanceof Function)
                instance.build.apply(instance, arguments);
            if (instance.init instanceof Function)
                instance.init.apply(instance, arguments);
        };
    },
    Stack: Stack,
    prototype: {
        name: "UserError",
        init: function (config) {
            if (typeof (config) == "string")
                config = {message: config};
            this.merge(config);
        },
        clone: function () {
            var subject = this;
            var instance = Object.create(subject);
            if (subject !== subject.constructor.prototype) {
                var getStack = stackAdapter.presentStack(instance, arguments.callee);
                if (getStack)
                    Object.defineProperties(instance, {
                        stack: {get: getStack}
                    });
            }
            if (instance.build instanceof Function)
                instance.build.apply(instance, arguments);
            return instance;
        }
    }
});
Class.absorb.call(UserError, Class);

module.exports = UserError;