Feature: Login and Create project and item and export spec sheet Project Flow

 
  # @run
  Scenario: login and create project and item and export spec sheet
    #login
    Given I am logged in and on the projects page
    #creating new project
    When I click on the Create New Project button
    Then the "Create New Project" modal should be visible
    When I enter "Test Project with Item" into the project name field
    Then the "Create Project" button should be enabled
    When I click on the login "Create Project" button
    Then I should be redirected to the project page
    #creating new item  
    When I click on the Create New Item button
    Then the "Create New Item" modal should be visible
    When I enter "Test Item" into the item name field
    Then the item name field should contain "Test Item"
    When I type "kitchen" into the item area dropdown
    And I select the dropdown option "Create option 'kitchen'"
    Then the item area field should contain "kitchen"
    When I type "Accessory" into the schedule field dropdown
    Then the schedule field should contain "Accessory"
    When I type "Mirror" into the item type field dropdown
    Then the item type field should contain "Mirror"
    And user clicks on the "Create Item" button
    Then item should be created successfully
    #export spec sheet
    When I click on the action button of the item modal
    And I select the "Export Spec Sheet" export type from action button dropdown
    And I click the next button on the export modal
    And I click the next button on the export modal again
    And I click the export & save button on the export folder modal
    Then the export should be initiated
    # And I click on the view export button
    
  # @export
  # Scenario: Export item specification
  #   Given I am logged in and on the projects page
  #   When I click on the "Test Project with Item" project
  #   # The item should already exist from the previous test
  #   Then I should see the text "Test Item"
  #   When I click on the "Test Item" item
  #   Then the newly created item modal should be visible
    # When I click on the action button of the "Test Item" item modal
    # And I select the "Line Item" export type
    # Then the export should be initiated

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
