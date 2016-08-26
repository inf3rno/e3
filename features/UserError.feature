Feature: UserError
  As a user of the EZone lib
  I want to use error subclasses
  So handling errors by type will be easier

  Scenario: instantiating user error with custom properties
    When I create a new user error instance with custom properties
    Then this instance should contain the custom properties

  Scenario: using the stack of user errors
    When I create a new user error instance
    Then the stack property should contain the type, the message and the stack frames of this instance
    And the stack property should not be configurable, writable or enumerable

  Scenario: extending user errors
    When I create an user error descendant
    Then first stack frame of that descendant should be the instantiation code

  Scenario: extending user errors in strict mode
    When I create an user error descendant in strict mode
    Then the stack property should be created without causing any error related to strict mode
    And the function value of the frames should be undefined because strict mode does not support arguments.callee

  Scenario: extending user errors and overriding constructor or clone
    When I create an user error descendant which overrides the constructor or the clone
    Then it should not be able to call the constructor and clone methods of the ancestor