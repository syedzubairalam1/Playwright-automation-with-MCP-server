Feature: Project Creation
 

@run
  Background:
    Given I am logged in and on the projects page
    
  Scenario: Create a new project
 
    When I click on the Create New Project button
    Then the "Create New Project" modal should be visible
    When I enter "Test Project with Item" into the project name field
    Then the "Create Project" button should be enabled
    When I click on the login "Create Project" button
    Then I should be redirected to the project page 