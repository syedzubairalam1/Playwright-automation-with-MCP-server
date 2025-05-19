Feature: Project CRUD Operations
 
 

  

  @run
  @project
  Scenario: Create a new project
    Given I am logged in and on the projects page
    When I click on the Create New Project button
    And I enter "Automation Test Project" into the project name field
    And user clicks on the "Create Project" button
    Then I should be redirected to the project page

  @run
  @project
  Scenario: Verify a project
    Given I am logged in and on the projects page
    When I click on the Automation Test Project project
    Then I should see the text Automation Test Project

  @run
  @project
  Scenario: Edit a project
    Given I am logged in and on the projects page
    When I click on the Automation Test Project project
    And user clicks on the Edit Project button
    Then the edit project form should be displayed

  @run
  @project
  Scenario: Delete a project
    Given I am logged in and on the projects page
    When I navigate to the project list page
    And I click on the archive icon
    And a dialog might appear which I dismiss
    
   