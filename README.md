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

 - node v4.2 and v5.x
 - chrome 51.0
 - firefox 47.0 and 48.0
 - internet explorer 11.0
 - phantomjs 2.1
 
by the usage of npm scripts under win7 x64.

I wasn't able to test the framework by Opera since the Karma launcher is buggy, so I decided not to support Opera.

I used [Yadda](https://github.com/acuminous/yadda) to write BDD tests.
I used [Karma](https://github.com/karma-runner/karma) with [Browserify](https://github.com/substack/node-browserify) to test the framework in browsers.

The pre-ES5 environments are not supported.

#### Requirements

An ES5 capable environment and the o3 lib.

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
    console.log(theProblem.stack);
        // MyError: problem
            // at (example.js:2:16)
            // at ...
            // ...
}
```

#### Creating composite errors

You can create composite errors by the usage of the CompositeError class if you want to report about complex problems, which can only be described by a hierarchy of error objects.

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
    console.log(theComplexProblem.stack);
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

You can wrap native errors to get a similar stack then we usually have by user errors.

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

The NativeError wrapper can help in logging the native errors of your client side applications for further investigation.

## License

MIT - 2015 Jánszky László Lajos