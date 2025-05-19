Feature: Verify Project Settings Content
  
@project-settings-content
  Scenario: Verify the content structure of the Project Settings modal
    Given I am logged in and on the projects page
    When I select a project from the list
    When I click on the gear icon
    Then project settings modal should open
    And the modal should display three columns
    And the first column should contain input fields
    And the second column should contain checkboxes for client actions
    And the third column should contain checkboxes for client visibility 