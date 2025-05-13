Feature: Export Spec Sheet
  As a user
  I want to export spec sheets for items
  So that I can share item specifications

  
   
    # Assume we're in an item view
    @run
  Scenario: Export item spec sheet
   Given I am logged in and on the projects page
       When I select a project from the list
And I click on any item from the project page 
    When I click on the action button of the item modal
    And I select the "Export Spec Sheet" export type from action button dropdown
    And I click the next button on the export modal
    And I click the next button on the export modal again
    And I click the export & save button on the export folder modal
    Then the export should be initiated 