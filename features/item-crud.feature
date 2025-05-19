 @item-crud
Feature: Item CRUD Operations

  @run
  Scenario: Create a new item
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the Create New Item button
    Then the "Create New Item" modal should be visible
    When I enter "Test Item" into the item name field
    Then the item name field should contain "Test Item"
    When I type "kitchen" into the item area dropdown
    And I select the dropdown option "Create option 'kitchen'"
    When I type "Accessory" into the schedule field dropdown
    Then the schedule field should contain "Accessory"
    When I type "Mirror" into the item type field dropdown
    Then the item type field should contain "Mirror"
    When user clicks on the "Create Item" button
    Then item should be created successfully
    
  @run
  Scenario: verify an existing item
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the item
    Then I should see the item name "Test Item"
    
  @run
  Scenario: Update an existing item
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the item 
    And I update the item name to "Updated Test Item"
    Then the item should be updated successfully
   
     
  @run
  Scenario: Delete an existing item
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the item  
    And I click on the delete button for the item
    And I confirm the item deletion
    Then the item should be deleted successfully
   