var expect = require("expect.js"),
    sinon = require("sinon"),
    e3 = require("../.."),
    CompositeError = e3.CompositeError,
    UserError = e3.UserError;

module.exports = function () {

    var anInstance;

    this.When(/^I create a new composite error instance$/, function (next) {
        anInstance = new CompositeError();
        next();
    });

    this.When(/^this instance contains other error instances$/, function (next) {
        var factory = function () {
            return new UserError("qqq");
        };
        anInstance.merge({
            message: "xxx",
            a: new Error("yyy"),
            b: new CompositeError({
                message: "zzz",
                x: factory()
            })
        });
        next();
    });

    this.Then(/^the stack of this instance should include the stack of the other error instances$/, function (next) {
        expect(anInstance.toString()).to.be("CompositeError: xxx");
        expect(/CompositeError: xxx/.test(Error.getStackTrace(anInstance))).to.be.ok();
        expect(/caused by <a> Error: yyy/.test(Error.getStackTrace(anInstance))).to.be.ok();
        expect(/caused by <b> CompositeError: zzz/.test(Error.getStackTrace(anInstance))).to.be.ok();
        expect(/caused by <b.x> UserError: qqq/.test(Error.getStackTrace(anInstance))).to.be.ok();
        expect(/factory/.test(Error.getStackTrace(anInstance))).to.be.ok();
        next();
    });

};