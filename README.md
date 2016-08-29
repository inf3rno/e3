# ErrorZone - Javscript Error Framework

[![Build Status](https://travis-ci.org/inf3rno/e3.png?branch=master)](https://travis-ci.org/inf3rno/e3)

The ErrorZone framework helps to use error stack data more efficiently.

## Installation

```bash
npm install ezone
```

```bash
bower install e3
```

### Environment compatibility

This framework supports the same environments as the [error polyfill](https://github.com/inf3rno/error-polyfill) lib.

I used [Karma](https://github.com/karma-runner/karma) with [Browserify](https://github.com/substack/node-browserify) to test the framework in browsers and I used [Yadda](https://github.com/acuminous/yadda) to run the BDD tests.

### Requirements

The [error polyfill](https://github.com/inf3rno/error-polyfill) and the [o3](https://github.com/inf3rno/o3) libs are required.

## Usage

In this documentation I used the framework as follows:

```js
var e3 = require("ezone"),
    UserError = e3.UserError,
    CompositeError = e3.CompositeError,
    Stack = e3.Stack,
    CompositeStack = e3.CompositeStack;
```

### Errors

#### Creating custom errors

You can create custom `Error` sub-classes by extending the `UserError` class.

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

Overriding and reusing the `constructor` and the `clone` method is not recommended by descendant classes, use `build` and `init` instead!

#### Creating composite errors

You can create composite errors with the `CompositeError` class if you want to report complex problems, which can only described by a hierarchy of error objects.

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

The `CompositeError` can be a great help for example by nested validation errors or by reporting about multiple parallel async failures.

#### Accessing stack frames

If you have your `Stack` instance, you can access the frames array by reading the `stack.frames` property.

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