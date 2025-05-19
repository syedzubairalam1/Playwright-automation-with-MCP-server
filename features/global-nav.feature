Feature: Global Nav

  @run
  @global-nav-presence
  Scenario: Verify Global Nav Bar Presence
    # Checks for the basic structure of the global navigation bar
    Given I am logged in and on the projects page
    Then I should see a black bar at the top of the page
    And I should see the client test mode switch on the right side 

  @run
  @global-nav-presence-on-other-pages
  Scenario: Verify the visibility and functionality of the Gather logo.
    Given I am logged in and on the projects page
    Then the gather logo should be visible on the left side of the global nav bar
    When I click on the gather logo
    Then the user should be redirected to the projects page

  @run
  @global-nav-menu-items
  Scenario: Verify navigation menu items
    Given I am logged in and on the projects page
    Then I should see the Projects navigation item
    And I should see the Contacts navigation item
    And I should see the Library navigation item
