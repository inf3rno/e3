Feature: NativeError
  As a user of the EZone lib
  I want to use native error wrappers
  So getting a stack format compatible with the o3 error api will be easier

  Scenario: using the stack of native errors
    When I create a new native error instance and I wrap that instance
    Then the stack property should contain the type, the message and the stack frames of this native error