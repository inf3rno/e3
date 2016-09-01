Feature: Stack
  As a user of the EZone lib
  I want to use a stack object instead of a stack string
  So accessing frame information will be much easier

  Scenario: expecting a stack string instead of a stack object
    When I have a Stack instance and call String methods like split on it
    Then the Stack instance should return the same result as if it were converted to a string