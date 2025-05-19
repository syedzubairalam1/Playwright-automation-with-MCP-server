@project-settings
Feature: Project Settings Fields Update


  Background:
    Given I am logged in and on the projects page
    When I select a project from the list
    And I navigate to project settings

Scenario: Verify Updating Input Fields of project setting
  # @project-name
  # Scenario: Update Project Name
    When I click on the Project Name field
    And I enter "Updated Project Name" into the Project Name field
    Then the Project Name field should contain "Updated Project Name"

  # @project-number
  # Scenario: Update Project Number
    When I click on the Project Number field
    And I enter "PRJ-12345" into the Project Number field
    Then the Project Number field should contain "PRJ-12345"

  # @project-budget
  # Scenario: Update Project Budget
    When I click on the Project Budget field
    And I enter "50000" into the Project Budget field
    Then the Project Budget field should contain "50000"

  # @project-markup
  # Scenario: Update Project Markup Percentage
    When I click on the Project Markup field
    And I enter "15" into the Project Markup field
    And I press Enter
    And I click on the yes button
    Then the Project Markup field should contain "15"

  # @project-sales-tax
  # Scenario: Update Project Sales Tax Percentage
    When I click on the Project Sales Tax field
    And I enter "7.5" into the Project Sales Tax field
    And I press Enter
    And I click on the yes button
    Then the Project Sales Tax field should contain "7.5"

  # @project-shipping
  # Scenario: Update Shipping Percentage
    When I click on the Shipping field
    And I enter "5" into the Shipping field
     And I press Enter
    And I click on the yes button
    Then the Shipping field should contain "5"

  # @project-currency
  # Scenario: Update Currency
    When I click on the Currency dropdown
    And I select "US Dollar" from the Currency dropdown
    Then the Currency dropdown should show "US Dollar" 

    # Scenario: save project setting 
    When I click on the save project button
    Then project setting should be saved

  @project-markup-tooltip-select-yes
  Scenario: Verify the project markup functionality
    When I locate the project markup field with tooltip
    And I hover over the project markup tooltip
    Then tooltip information should appear
    When I enter "20" in the project markup field
    And I press Enter to save value
    Then all existing values should not be overridden
    When I click on the yes button
    Then all existing values should be overridden
    When I click on the save project button
    Then project setting should be saved

    @project-markup-tooltip-select-no
  Scenario: Verify the project markup functionality
    When I locate the project markup field with tooltip
    And I hover over the project markup tooltip
    Then tooltip information should appear
    When I enter "14" in the project markup field
    And I press Enter to save value
   Then all existing values should not be overridden
    When I click on the No button
    Then all existing values should not be overridden
    When I click on the save project button
    Then project setting should be saved


@project-project-Sales-tax-select-yes
  Scenario: Verify the project sales tax functionality
    When I locate the project sale tax field with tooltip
    And I hover over the project sales tax tooltip
    Then tooltip information should appear
    When I enter "11" into the Project Sales Tax field
    And I press Enter to save value
    Then a dialog asking about overriding values should appear
    When I click on the yes button
    Then all existing values should be overridden
    When I click on the save project button
    Then project setting should be saved

    @project-project-Sales-tax-select-no
  Scenario: Verify the project sales tax
    When I locate the project sale tax field with tooltip
    And I hover over the project sales tax tooltip
    Then tooltip information should appear
    When I enter "10" into the Project Sales Tax field
    And I press Enter to save value
    Then a dialog asking about overriding values should appear
    When I click on the No button
    Then all existing values should not be overridden
    When I click on the save project button
    Then project setting should be saved

    @project-shipping-select-yes
  Scenario: Verify the project shipping functionality
    When I locate the project shipping field with tooltip
    And I hover over the shipping tax tooltip
    Then tooltip information should appear
    When I enter "25" into the Shipping field
    And I press Enter to save value
    Then a dialog asking about overriding values should appear
    When I click on the yes button
    Then all existing values should be overridden
    When I click on the save project button
    Then project setting should be saved

    @project-shipping-select-no
  Scenario: Verify the project shipping functionality
   When I locate the project shipping field with tooltip
    And I hover over the shipping tax tooltip
    Then tooltip information should appear
    And I enter "35" into the Shipping field
    And I press Enter to save value
    Then a dialog asking about overriding values should appear
    When I click on the No button
    Then all existing values should not be overridden
    When I click on the save project button
    Then project setting should be saved

 @project-currency-selection
    Scenario: Verify the currency selection functionality
    When I locate the currency select menu
    Then currency select menu should be present with multiple options
    And I select "Canadian Dollar" from the Currency dropdown
    Then the Currency dropdown should show "Canadian Dollar" 
    When I click on the save project button
    Then project setting should be saved
    Then project should update with new currency
    

      