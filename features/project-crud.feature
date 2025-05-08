@run
Feature: Project CRUD Operations
  As a user
  I want to manage projects
  So that I can organize my work effectively

  Background:
    Given I am logged in and on the projects page

  Scenario: Create a new project
      # Given I am logged in and on the projects page
    When I click on the Create New Project button
    Then the "Create Project" modal should be visible
    When I enter "Automation Test Project" into the project name field
    Then the "Create Project" button should be enabled
    When user clicks on the "Create Project" button
    Then I should be redirected to the project page

  # Scenario: Read project details
    When I click on the Automation Test Project project
    
# 
  # Scenario: Update project name
    # When I click on the "Automation Test Project" project
    And user clicks on the Edit Project button
    # Then the "Edit Project" modal should be visible
    # When I enter "Updated Automation Project" into the project name field
    # And user clicks on the "Save" button
    # Then I should see the text "Updated Automation Project"

  # Scenario: Delete a project - removed as requested Feature: Edit project in MCP

  # Scenario: Navigate to project page and click edit icon
    When I navigate to the project list page
    And I click on the archive icon
     And a dialog might appear which I dismiss
   