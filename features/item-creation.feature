  @item-creation
Feature: Item Creation with different fields input
  
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
  Scenario: create a new item with different fields input
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the Create New Item button
    Then the "Create New Item" modal should be visible
    When I enter "Test Item 2" into the item name field
    Then the item name field should contain "Test Item 2"
    When I type "Appliance" into the item area dropdown
    And I select the dropdown option "Create option 'Appliance'"
    When I type "Artwork" into the schedule field dropdown
    Then the schedule field should contain "Artwork"
    When I type "Painting" into the item type field dropdown
    Then the item type field should contain "Mirror"
     When user clicks on the "Create Item" button
    Then item should be created successfully 
   

