var expect = require("expect.js"),
    sinon = require("sinon"),
    UserError = require("../..").UserError;

module.exports = function () {

    var anInstance,
        aDescendant;

    this.When(/^I create a new user error instance with custom properties$/, function (next) {
        anInstance = new UserError({
            message: "blah",
            a: 1,
            b: 2
        });
        next();
    });

    this.Then(/^this instance should contain the custom properties$/, function (next) {
        expect(anInstance).to.be.an(UserError);
        expect(anInstance.a).to.be(1);
        next();
    });

    this.When(/^I create a new user error instance$/, function (next) {
        var firstFn = function firstFn() {
            secondFn();
        };
        var secondFn = function secondFn() {
            thirdFn();
        };
        var thirdFn = function thirdFn() {
            anInstance = new UserError("the problem");
        };
        firstFn();
        next();
    });

    this.Then(/^the stack property should contain the type, the message and the stack frames of this instance$/, function (next) {
        expect(/UserError: the problem/.test(Error.getStackTrace(anInstance))).to.be.ok();
        expect(/thirdFn/.test(Error.getStackTrace(anInstance).frames[0])).to.be.ok();
        expect(/secondFn/.test(Error.getStackTrace(anInstance).frames[1])).to.be.ok();
        expect(/firstFn/.test(Error.getStackTrace(anInstance).frames[2])).to.be.ok();
        next();
    });

    this.Then(/^the stack property should have a getter and be configurable, but not enumerable$/, function (next) {
        var descriptor = Object.getOwnPropertyDescriptor(anInstance, "stack");
        expect(!!descriptor.get).to.be.ok();
        expect(descriptor.configurable).to.be(true);
        expect(descriptor.enumerable).to.be(false);
        next();
    });

    this.When(/^I create an user error descendant$/, function (next) {
        aDescendant = UserError.extend({
            prototype: {
                name: "aDescendant"
            }
        });
        next();
    });

    this.Then(/^first stack frame of that descendant should be the instantiation code$/, function (next) {
        var factory = function () {
            anInstance = new aDescendant("message");
        };
        factory();
        if (Error.getStackTrace(anInstance).frames[0].getFunction())
            expect(Error.getStackTrace(anInstance).frames[0].getFunction() === factory).to.be.ok();
        expect(/factory/.test(Error.getStackTrace(anInstance).frames[0].toString())).to.be.ok();
        next();
    });

    this.When(/^I create an user error descendant in strict mode$/, function (next) {
        "use strict";
        aDescendant = UserError.extend({
            prototype: {
                name: "aDescendant"
            }
        });
        next();
    });

    this.Then(/^the stack property should be created without causing any error related to strict mode$/, function (next) {
        "use strict";
        expect(function () {
            anInstance = new aDescendant();
            Error.getStackTrace(anInstance).toString();
        }).to.not.throwError();
        next();
    });

    this.Then(/^the function value of the frames should be undefined because strict mode does not support arguments.callee$/, function (next) {
        expect(Error.getStackTrace(anInstance).frames[0].getFunction() === undefined).to.be.ok();
        next();
    });

    this.When(/^I create an user error descendant which overrides the constructor or the clone$/, function (next) {
        aDescendant = UserError.extend({
            prototype: {
                constructor: function () {
                    UserError.call(this, "message");
                },
                clone: function () {
                    return UserError.prototype.clone.call(this);
                }
            }
        });
        next();
    });

    this.Then(/^it should not be able to call the constructor and clone methods of the ancestor$/, function (next) {
        expect(function () {
            anInstance = new aDescendant();
        }).to.throwError();
        expect(function () {
            anInstance = aDescendant.prototype.clone();
        }).to.throwError();
        next();
    });
};