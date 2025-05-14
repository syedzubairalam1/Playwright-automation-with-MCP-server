Feature: Export Spec Sheet
  
  Background:
    Given I am logged in and on the projects page
    
  # @run
  Scenario: Export a spec sheet
    Given I select a project from the list
    When I click on the Create New Item button
    Then the "Create New Item" modal should be visible
    When I enter "Test Item" into the item name field
    And I click on the "Create Item" button
    When I click on the action button of the item modal
    And I select the "Export Spec Sheet" export type from action button dropdown
    And I click the next button on the export modal
    And I click the next button on the export modal again
    And I click the export & save button on the export folder modal
    Then the export should be initiated

