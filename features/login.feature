Feature: User Login
  

@run
  Scenario: User successfully logs in
    Given I navigate to the login page
    When I enter username
    And I enter password
    And I click on login button 