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
        expect(/UserError: the problem/.test(anInstance.stack)).to.be.ok();
        expect(/thirdFn/.test(anInstance.stack.frames[0])).to.be.ok();
        expect(/secondFn/.test(anInstance.stack.frames[1])).to.be.ok();
        expect(/firstFn/.test(anInstance.stack.frames[2])).to.be.ok();
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
        expect(anInstance.stack.frames[0].getFunction() === factory).to.be.ok();
        expect(/factory/.test(anInstance.stack.frames[0].toString())).to.be.ok();
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
            anInstance.stack.toString();
        }).to.not.throwError();
        next();
    });

    this.Then(/^the function value of the frames should be undefined because strict mode does not support arguments.callee$/, function (next) {
        expect(anInstance.stack.frames[0].getFunction() === undefined).to.be.ok();
        next();
    });
};