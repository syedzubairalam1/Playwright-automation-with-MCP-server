Feature: Area CRUD Operations
 
  Background:
    Given I am logged in and on the projects page
    
  @run
  Scenario: Create, update, and delete an area
  Given I am logged in and on the projects page
  When I select a project from the list
  And I click on the new area input field
  And I enter "Test area" into the area name field
  And I click the Add Area button
  Then the "Test area" area should be created successfully
  When I update the area name
  And I press Enter
  Then the area name should be updated to "update area name"
  When I click on the archives icon of the areas
  And I click on okay button to confirm the deletion
  Then the area should be deleted successfully
