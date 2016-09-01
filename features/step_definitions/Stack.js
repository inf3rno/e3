var expect = require("expect.js"),
    sinon = require("sinon"),
    UserError = require("../..").UserError;

module.exports = function () {

    var anInstance;

    this.When(/^I have a Stack instance and call String methods like split on it$/, function (next) {
        anInstance = Error.getStackTrace(new UserError({
            message: "blah"
        }));
        next();
    });

    this.Then(/^the Stack instance should return the same result as if it were converted to a string$/, function (next) {
        expect(function () {
            anInstance.split("\n");
        }).to.not.throwError();
        expect(anInstance.split("\n")).to.eql(anInstance.toString().split("\n"));
        next();
    });

};