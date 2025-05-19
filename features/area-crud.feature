 @area-crud
Feature: Area CRUD Operations

  @run
  Scenario: Create a new area
    Given I am logged in and on the projects page
    When I select a project from the list of projects
    And I click on the new area input field
    And I enter "Test area" into the area name field
    And I click the Add Area button
    Then the "Test area" area should be created successfully

  @run
  Scenario: Verify the area name
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the area with name "Test area"
    Then the area details should show name "Test area"

  @run
  Scenario: Update an existing area
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the area with name "Test area"
    And I update the area name
    And I press Enter
    Then the area name should be updated to "update area name"

  @run
  Scenario: Delete an existing area
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the area with name "update area name"
    And I click on the archives icon of the areas
    And I click on okay button to confirm the deletion
    Then the area should be deleted successfully