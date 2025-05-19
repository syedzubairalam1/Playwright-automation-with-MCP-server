Feature: Gather Login functionality

@run
  Scenario: Verify login form UI elements visibility
    Given I navigate to the login page
    Then the email field should be visible
    And the password field should be visible
    And the login button should be visible

  @run
  Scenario: Click login button with valid credentials
    Given I navigate to the login page
    When I enter username
    And I enter password
    And I click on login button
    Then I should be redirected to the project page

 

  @run
  Scenario: Click login button with invalid credentials
    Given I navigate to the login page
    When I enter invalid username
    And I enter invalid password
    And I click on login button
    Then I should see an error message

  

  @run
  @empty-username
  Scenario: Click login button with empty username
    Given I navigate to the login page
    When I enter empty username
    And I enter password
    And I click on login button
    Then I should see an error please fill in the username

  
    

  @run
  Scenario: Click login button with empty password
    Given I navigate to the login page
    When I enter username
    And I enter empty password
    And I click on login button
    Then I should see an error please fill in the password

  



