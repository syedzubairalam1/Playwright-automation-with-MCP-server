Feature: Project CRUD Operations
 
@run
  Background:
    Given I am logged in and on the projects page

  Scenario: Create a new project
    When I click on the Create New Project button
    Then the "Create Project" modal should be visible
    When I enter "Automation Test Project" into the project name field
    Then the "Create Project" button should be enabled
    When user clicks on the "Create Project" button
    Then I should be redirected to the project page
    When I click on the Automation Test Project project
    And user clicks on the Edit Project button
    When I navigate to the project list page
    And I click on the archive icon
    And a dialog might appear which I dismiss
   