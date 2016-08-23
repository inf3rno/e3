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

By native errors you need a NativeError wrapper to access the `error.stack` property.

```js
try {
    notDefinedFunction();
} catch (error) {
    var wrapper = new NativeError(error);
    console.log(wrapper.stack instanceof Stack); // true
}
```

Reading the `error.stack` directly returns only a raw stack string in most of the environments, so it is not recommended.

If you have your Stack instance, you can access the frames array by reading the `stack.frames` property.

```js
var stack = error.stack;
var frames = stack.frames;
for (var index in frames) {
    var frame = frames[index];
    console.log(frame.toString()); // e.g. "fn (example.js:1:1)"
    console.log(frame.getFunction()); // e.g. function fn(){}
}
```

To access information about individual frames you can use these methods:

- `frame.toString()` - Supported by Node.js, Chrome, Firefox, Internet Explorer, Opera and PhantomJS.
- `frame.getThis()` - Supported by Node.js and Chrome.
- `frame.getTypeName()` - Supported by Node.js and Chrome.
- `frame.getFunction()` - Supported by Node.js, Chrome, Firefox, Internet Explorer, Opera and PhantomJS.
- `frame.getFunctionName()` - Supported by Node.js and Chrome.
- `frame.getMethodName()` - Supported by Node.js and Chrome.
- `frame.getFileName()` - Supported by Node.js and Chrome.
- `frame.getLineNumber()` - Supported by Node.js and Chrome.
- `frame.getColumnNumber()` - Supported by Node.js and Chrome.
- `frame.getEvalOrigin()` - Supported by Node.js and Chrome.
- `frame.isTopLevel()` - Supported by Node.js and Chrome.
- `frame.isEval()` - Supported by Node.js and Chrome.
- `frame.isNative()` - Supported by Node.js and Chrome.
- `frame.isConstructor()` - Supported by Node.js and Chrome.

You can read more about them in the [V8 Stack Trace API documentation](https://github.com/v8/v8/wiki/Stack-Trace-API).

#### Stack trace limits

Not implemented yet.

### Uncaught errors and rejections

Not implemented yet.

### Differences between environments and modes

Since there is no Stack Trace API standard, every browsers solves this problem differently. 
I try to document what I've found about these differences as detailed as possible, so it will be easier to follow the code.

Overriding the `error.stack` property with custom Stack instances
 
 - by Node.js and Chrome the `Error.prepareStackTrace()` can override every `error.stack` automatically right by creation
 - by Firefox, Internet Explorer and Opera you cannot automatically override every `error.stack` by native errors
 - by PhantomJS you cannot override the `error.stack` property of native errors, it is not configurable
 
Capturing the current stack trace
 
 - by Node.js, Chrome, Firefox and Opera the stack property is added by instantiating a native error
 - by Node.js and Chrome the stack creation is lazy loaded and cached, so the `Error.prepareStackTrace()` is called only by the first access
 - by Node.js and Chrome the current stack can be added to any object with `Error.captureStackTrace()`
 - by Internet Explorer the stack is created by throwing a native error
 - by PhantomJS the stack is created by throwing any object, but not a primitive
 
Accessing the stack
 
 - by Node.js, Chrome, Firefox, Internet Explorer, Opera and PhantomJS you can use the `error.stack` property
 - by old Opera you have to use the `error.stacktrace` property to get the stack
 
Prefixes and postfixes on the stack string
 
 - by Node.js, Chrome, Internet Explorer and Opera you have the `error.name` and the `error.message` in a `{name}: {message}` format at the beginning of the stack string
 - by Firefox and PhantomJS the stack string does not contain the `error.name` and the `error.message`
 - by Firefox you have an empty line at the end of the stack string
 
Accessing the stack frames array

 - by Node.js and Chrome you can access the frame objects directly by overriding the `Error.prepareStackTrace()`
 - by Firefox, Internet Explorer, PhantomJS, and Opera you need to parse the stack string in order to get the frames
 
The structure of the frame string

 - by Node.js and Chrome
  - the frame string of calling a function from a module: `thirdFn (http://localhost/myModule.js:45:29)`
  - the frame strings contain an `   at ` prefix, which is not present by the `frame.toString()` output, so it is added by the `stack.toString()`
 - by Firefox
  - the frame string of calling a function from a module: `thirdFn@http://localhost/myModule.js:45:29`
 - by Internet Explorer
  - the frame string of calling a function from a module: `   at thirdFn (http://localhost/myModule.js:45:29)`
 - by PhantomJS
  - the frame string of calling a function from a module: `thirdFn@http://localhost/myModule.js:45:29`
 - by Opera
  - the frame string of calling a function from a module: `   at thirdFn (http://localhost/myModule.js:45)`
   
Accessing information by individual frames

 - by Node.js and Chrome the `frame.getThis()` and the `frame.getFunction()` returns `undefined` by frames originate from [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) code
 - by Firefox, Internet Explorer, PhantomJS, and Opera the context of the function calls is not accessible, so the `frame.getThis()` cannot be implemented
 - by Firefox, Internet Explorer, PhantomJS, and Opera functions are not accessible with `arguments.callee.caller` by frames originate from strict mode, so by these frames `frame.getFunction()` can return only `undefined` (this is consistent with V8 behavior)

## License

MIT - 2015 Jánszky László Lajos