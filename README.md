# EZone - Javscript Error Framework

[![Build Status](https://travis-ci.org/inf3rno/e3.png?branch=master)](https://travis-ci.org/inf3rno/e3)

The EZone framework implements a V8 Error API polyfill as much as possible and adds new error handling related features to the system.

## Documentation

### Installation

```bash
npm install ezone
```

```bash
bower install e3
```

#### Environment compatibility

The framework succeeded the tests on

 - **Node.js** v4.2 and v5.x
 - **Chrome** 51.0
 - **Firefox** 47.0 and 48.0
 - **Internet Explorer** 11.0
 - **PhantomJS** 2.1
 
by the usage of npm scripts under win7 x64.

I wasn't able to test the framework by **Opera** since the Karma launcher is buggy, but I try to support that browser as well.
I try to do graceful degradation, so the lib should work more or less by non-tested browsers, except those without ES5 support.
ES5 features are tested by the [capability](https://github.com/inf3rno/capability) lib. The pre-ES5 environments are not supported. 

I used [Yadda](https://github.com/acuminous/yadda) to write BDD tests.
I used [Karma](https://github.com/karma-runner/karma) with [Browserify](https://github.com/substack/node-browserify) to test the framework in browsers.

#### Requirements

The [capability](https://github.com/inf3rno/capability) and the [o3](https://github.com/inf3rno/o3) libs are required.

#### Usage

In this documentation I used the framework as follows:

```js
var e3 = require("ezone"),
    UserError = e3.UserError,
    CompositeError = e3.CompositeError,
    NativeError = e3.NativeError,
    Stack = e3.Stack,
    CompositeStack = e3.CompositeStack;
```

### Polyfills

If polyfills are all you need, then use `require("ezone/polyfill");`.

#### Error.captureStackTrace

Currently the `Error.captureStackTrace(targetObject [, constructorOpt])` is partially supported in non-V8 environments. It does not work if the `constructorOpt` is not the direct caller of this function.

#### Error.prepareStackTrace

The `Error.prepareStackTrace(throwable, frames [, comments])` is supported by the library. The third parameter can contain an array of stack parser warnings.

#### Error.getStackTrace

By V8 the `Error.prepareStackTrace` is automatically called by trying to get the stack of any native error. Sadly on non-V8 environments there is on way to implement the same feature. So using `Error.getStackTrace(error)` is recommended by getting the stack of an Error instance.

### Errors

#### Creating custom errors

You can create custom Error sub-classes by extending the UserError class.

```js
var MyError = UserError.extend({
    prototype: {
        name: "MyError"
    }
});

try {
    throw new MyError("problem");
}
catch (theProblem) {
    if (!(theProblem instanceof MyError))
        throw theProblem;
    console.log(theProblem);
        // MyError: problem
    console.log(Error.getStackTrace(theProblem).toString());
        // MyError: problem
            // at (example.js:2:16)
            // at ...
            // ...
}
```

*Warning:*
&nbsp;&nbsp;&nbsp;&nbsp;*Overriding and reusing the `constructor` and the `clone` method is not possible by descendant classes, use `build` and `init` instead!*

#### Creating composite errors

You can create composite errors with the CompositeError class if you want to report about complex problems, which can only be described by a hierarchy of error objects.

```js
var MyCompositeError = CompositeError.extend({
    prototype: {
        name: "MyCompositeError"
    }
});

try {
    try {
        throw new MyError("problem");
    }
    catch (theProblem) {
        throw new MyCompositeError({
            message: "complex problem",
            theSource: theProblem
        })
    }
}
catch (theComplexProblem) {
    console.log(Error.getStackTrace(theComplexProblem).toString());
        // MyCompositeError: complex problem
            // at (example.js:5:32)
            // at ...
            // ...
        // caused by <theSource> MyError: problem
            // at (example.js:2:16)
            // at ...
            // ...
}
```

The CompositeError can be a great help for example by nested validation errors or by reporting about multiple parallel async failures.

#### Accessing stack frames

If you have your Stack instance, you can access the frames array by reading the `stack.frames` property.

```js
var stack = Error.getStackTrace(error);
var frames = stack.frames;
for (var index in frames) {
    var frame = frames[index];
    console.log(frame.toString()); // e.g. "fn (example.js:1:1)"
    console.log(frame.getFunction()); // e.g. function fn(){}
}
```

## License

MIT - 2015 Jánszky László Lajos