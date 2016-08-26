var Class = require("o3").Class,
    Stack = require("./Stack"),
    stackAdapter = require("./stackAdapter");

var UserError = Class(Error, {
    factory: function () {
        return function construct() {
            if (this.constructor !== construct)
                throw new Error("Calling ancestor constructor from sub-classes is denied.");
            var instance = this;
            stackAdapter.presentStack(instance, construct);
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
        clone: function clone() {
            if (this.clone !== clone)
                throw new Error("Calling ancestor clone from sub-classes is denied.");
            var subject = this;
            var instance = Object.create(subject);
            if (subject !== subject.constructor.prototype)
                stackAdapter.presentStack(instance, clone);
            if (instance.build instanceof Function)
                instance.build.apply(instance, arguments);
            return instance;
        }
    }
});
Class.absorb.call(UserError, Class);

module.exports = UserError;