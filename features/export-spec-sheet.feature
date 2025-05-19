@export
Feature: Export Spec Sheet and Image Sheet from the Item modal
    
  @run
  Scenario: Verify the spec sheet export process
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the Create New Item button
    And I enter "Test Item" into the item name field
    And I click on the "Create Item" button
    And I click on the action button of the item modal
    And I select the "Export Spec Sheet" export type from action button dropdown
    And I click the next button on the export modal
    And I click the next button on the export modal again
    And I click the export & save button on the export folder modal
    Then the export should be initiated

  @run
  Scenario: Verify the image sheet export process
    Given I am logged in and on the projects page
    When I select a project from the list
    And I click on the Create New Item button
    And I enter "Test Item" into the item name field
    And I click on the "Create Item" button
    And I click on the action button of the item modal
    And I select the "Export Image Sheet" export type from action button dropdown
    And I click the next button on the export modal
    And I click the export & save button on the export folder modal
    Then the export should be initiated