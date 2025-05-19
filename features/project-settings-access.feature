
Feature: Project Settings Access Verification

  @project-settings-access
  Scenario: Verify Access to Project Settings
    Given I am logged in and on the projects page
    When I select a project from the list
    Then project navigation bar should be visible at the top of the screen
    When I locate the gear icon next to the project name
    Then gear icon should be visible next to the project name
    When I click on the gear icon
    Then project settings modal should open
    And modal title should read "Project Settings" 