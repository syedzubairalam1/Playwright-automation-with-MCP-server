Feature: User Login
  As a user
  I want to log in to the application
  So that I can access my projects

# @run
  Scenario: User successfully logs in
    Given I navigate to the login page
    When I enter username
    And I enter password
    And I click on login button 