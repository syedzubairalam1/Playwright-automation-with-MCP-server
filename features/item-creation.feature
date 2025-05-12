Feature: Item Creation
  As a user
  I want to create new items in a project
  So that I can track project components

  Background:
    Given I am logged in and on the projects page
    # Assume we're already in a project
    @run
  Scenario: Create a new item
     When I select a project from the list
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