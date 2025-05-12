# @run
Feature: Area CRUD Operations
  As a user
  I want to manage areas in a project
  So that I can organize my project effectively

  Background:
    Given I am logged in and on the projects page
    # @run
  Scenario: Create, update, and delete an area
    # Create area
    When I select a project from the list
    And I click on the new area input field
    And I enter "Test area" into the area name field
    And I click the Add Area button
    Then the "Test area" area should be created successfully
    
    # Update area
    # When I click on the Test area 
    And I update the area name to update area name
    And I press Enter
    Then the area name should be updated to "update area name"
    
    # Delete area
    When I click on the archieve icon of the area
    And I click on okay button to confirm the deletion
    Then the area should be deleted successfully 