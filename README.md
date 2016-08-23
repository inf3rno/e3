# EZone - Javscript Error API

[![Build Status](https://travis-ci.org/inf3rno/e3.png?branch=master)](https://travis-ci.org/inf3rno/e3)

The EZone lib contains enhanced error handling to ease the development of object-oriented javascript applications in an ES5 environment.

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
var e3 = require("e3"),
    UserError = e3.UserError,
    CompositeError = e3.CompositeError,
    NativeError = e3.NativeError;
```

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
    console.log(theProblem.stack.toString());
        // MyError: problem
            // at (example.js:2:16)
            // at ...
            // ...
}
```

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
    console.log(theComplexProblem.stack.toString());
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

#### Wrap native errors

You can wrap native errors to get a similar stack than you have by user errors.

```js
try {
    theNotDefinedFunction();
}
catch (error) {
    console.log(new NativeError(error).stack.toString());
        // ReferenceError: theNotDefinedFunction is not defined
            // at ...
            // ...
}
```

The NativeError wrapper can help you log the native errors of your client side applications for further investigation.

Be aware that the NativeError wrapper works only on the instances of Error or Error subclasses, so you won't be able to wrap a string or a regular object.

### Stack traces and frames

The current system tries to implement the [V8 Stack Trace API](https://github.com/v8/v8/wiki/Stack-Trace-API) by the actual environment as strictly as possible.

#### Accessing stack and frames

You can access the Stack instances by reading the `error.stack` property.

```js
var error = new UserError("message");
console.log(error.stack instanceof Stack); // true
```

By native errors you need a NativeError wrapper to access the `error.stack` property, since most of the environments don't support `Error.prepareStackTrace()`.

```js
try {
    notDefinedFunction();
} catch (error) {
    var wrapper = new NativeError(error);
    console.log(wrapper.stack instanceof Stack); // true
}
```

If you have your Stack instance, you can access the frames by reading the `stack.frames` property.

```js
var stack = error.stack;
var frames = stack.frames;
for (var index in frames) {
    var frame = frames[index];
    console.log(frame.toString()); // string representation of the frame, e.g. "fn (file:1:1)"
    console.log(frame.getFunction()); // the called function or undefined if not accessible
}
```

Currently only the `frame.toString()` and the `frame.getFunction()` are implemented in non-V8 environments.
The frame string parser is not completed yet.

#### Differences between environments and modes

Since there is no Stack Trace API standard, every browsers solves this problem differently. 
I try to document what I've found about these differences as detailed as possible, so it will be easier to follow the code.

Stack string structure and generation:

 - by Node.js and Chrome you can access the frame objects directly by overriding the `Error.prepareStackTrace()`
 - by Firefox, Internet Explorer, PhantomJS, and Opera you need to parse the stack string in order to get the frames
 - by PhantomJS you cannot override the `error.stack` property of native errors, so you have to create a NativeError wrapper class
 - by Internet Explorer and PhantomJS you have to throw the error in order to capture the stack
 - by old Opera you have to use the `error.stacktrace` property to get the stack
 - by Firefox and PhantomJS you don't have the `error.name` and the `error.message` at the beginning of the stack string
 - by Firefox you have an empty line at the end of the stack string
 
Frame string structures:
 
 - by Node.js and Chrome we don't parse frame strings, but it is important to know how to build a frame string from a frame object, so we can implement a similar `frame.toString()` in other environments
 - by Node.js and Chrome
  - the frame strings contain an `   at ` prefix, which is not present by the `frame.toString()`, so it is added by the `stack.toString()`
  - the frame string of calling a function from a module: `thirdFn (http://localhost/myModule.js:45:29)`
 - by Firefox
  - the frame string of calling a function from a module: `thirdFn@http://localhost/myModule.js:45:29`
 - by Internet Explorer
  - the frame string of calling a function from a module: `   at thirdFn (http://localhost/myModule.js:45:29)`
 - by PhantomJS
  - the frame string of calling a function from a module: `thirdFn@http://localhost/myModule.js:45:29`
 - by Opera
  - the frame string of calling a function from a module: `   at thirdFn (http://localhost/myModule.js:45)`
   
Accessible information about the frames:

 - by Firefox, Internet Explorer, PhantomJS, and Opera the context of the function calls is not accessible, so the `frame.getThis()` cannot be implemented
 - by strict mode (`"use strict"`) you cannot access `arguments.callee.caller`, so the `frame.getFunction()` is not accessible by function calls where the function was defined in strict mode

#### Stack trace limits

Not implemented yet.

### Uncaught errors and rejections

Not implemented yet.

## License

MIT - 2015 Jánszky László Lajos