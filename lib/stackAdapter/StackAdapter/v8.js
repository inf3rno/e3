var Class = require("o3").Class,
    Stack = require("../../Stack"),
    cache = require("../../utility/cache");

var ErrorContainer = Class(Object, {
    prototype: {
        init: function (error) {
            this.error = error;
        },
        getError: function () {
            return this.error;
        }
    }
});

var StackAdapter = Class(Object, {
    prototype: {
        constructor: function () {
            Object.defineProperties(Error, {
                prepareStackTrace: {
                    configurable: false,
                    writable: false,
                    value: function (throwable, frames) {
                        var error;
                        if (throwable instanceof ErrorContainer)
                            error = throwable.getError();
                        else if (throwable instanceof Error)
                            error = throwable;
                        if (error)
                            return new (error.constructor.Stack || Stack)(error, frames);
                        else
                            return new Stack(throwable, frames);
                    }
                }
            });
        },
        presentStack: function (error, toFunction) {
            var container = new ErrorContainer(error);
            Error.captureStackTrace(container, toFunction);
            Object.defineProperties(error, {
                stack: {
                    configurable: false,
                    get: cache(function () {
                        return container.stack;
                    })
                }
            });
        },
        pastStack: function (wrapper, error) {
            Object.defineProperties(wrapper, {
                stack: {
                    configurable: false,
                    get: cache(function () {
                        return error.stack;
                    })
                }
            });
        }
    }
});

module.exports = StackAdapter;