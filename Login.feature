Feature: Login and Create Project Flow

  @login
  Scenario: Verify login page UI elements
    Given I am on the login page "/users/sign_in"
    Then I should see the logo "Gather"
    And I should see the text "Log into your existing Gather account"
    And I should see the email field labeled "Email"
    And I should see the password field labeled "Password"
    And I should see an input with type "submit"

  @login
  Scenario: Login with valid credentials
    Given I am on the login page "/users/sign_in"
    When I enter "{username}" into the email field
    And I enter "{password}" into the password field
    And I click on the "Log In" button
    Then I should be redirected to the projects page
    And I should see a dashboard element

  # Scenario: Create a new project
    Given I am logged in and on the projects page
    When I click on the "Create New Project" button
    Then the "Create New Project" modal should be visible
    When I enter "Test Project" into the project name field
    Then the "Create Project" button should be enabled
    When I click on the "Create Project" button
    Then I should be redirected to the project page
    And I should see the text "Test Project"

  # Scenario: Create a new item
  #   Given I am on the "Test Project" page
  #   When I click on the "Create New Item" button
  #   Then the "Create New Item" modal should be visible
  #   When I enter "Test Item" into the item name field
  #   Then the item name field should contain "Test Item"
  #   When I type "kitchen" into the item area dropdown
  #   And I select the dropdown option "Create option 'kitchen'"
  #   Then the item area field should contain "kitchen"
  #   When I type "Accessory" into the schedule field dropdown
  #   Then the schedule field should contain "Accessory"
  #   When I type "Mirror" into the item type field dropdown
  #   Then the item type field should contain "Mirror" 
  #   When I click on the "Create New Item" button
  #   Then the newly created item modal should be visible

  # # Scenario: Export spec sheet

  #   # When I have newly created Item modal visible
  #   Then I should the "Actions" text on the Item modal header
  #   When I click on the "Actions" text
  #   Then the "Actions" dropdown should be open
  #   When I click on the "Export Spec Sheet" option from the dropdown
  #   Then the "Spec Sheet Export" modal should be visible
  #   When I click on the "Next" button in the spec sheet export modal
  #   And I click on the "Export & Save" button
  #   Then I should see a confirmation message "Generating ImageSheet"


    
  # Scenario: Verify form field interactions
  #   Given I am on the login page "go.gatherit.co/users/sign_in"
  #   When I click on the email field
  #   Then I should be able to type in the email field
  #   When I click on the password field
  #   Then I should be able to type in the password field
  #   And the password field should not have a visibility toggle
    
  # Scenario: Verify tab navigation
  #   Given I am on the login page "go.gatherit.co/users/sign_in"
  #   When I press the tab key
  #   Then the focus should move to the next field
    
  # Scenario: Verify field focus
  #   Given I am on the login page "go.gatherit.co/users/sign_in"
  #   When I click on the email field
  #   And I click elsewhere on the page
  #   And I click on the email field again
  #   Then the email field should be focused correctly
    
  # Scenario: Verify login button state
  #   Given I am on the login page "go.gatherit.co/users/sign_in"
  #   Then the login button should be disabled
  #   When I enter a valid email in the email field
  #   And I enter a password in the password field
  #   Then the login button should be enabled
    
  # Scenario: Verify email validation
  #   Given I am on the login page "go.gatherit.co/users/sign_in"
  #   When I enter an invalid email format in the email field
  #   Then the email field should show an error
  #   When I enter a valid email format in the email field
  #   Then the email field should not show an error
    
  # Scenario: Verify login with valid credentials
  #   Given I am on the login page "go.gatherit.co/users/sign_in"
  #   When I enter valid username and password
  #   And I click the login button
  #   Then I should be logged into my account
