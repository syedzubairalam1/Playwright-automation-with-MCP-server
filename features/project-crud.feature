# @project
# Feature: Project CRUD Operations
#   As a user
#   I want to manage projects
#   So that I can organize my work effectively

#   Background:
#     Given I am logged in and on the projects page

#   Scenario: Create a new project
#     When I click on the Create New Project button
#     Then the "Create Project" modal should be visible
#     When I enter "Automation Test Project" into the project name field
#     Then the "Create Project" button should be enabled
#     When I click on the "Create Project" button
#     Then I should be redirected to the project page

#   Scenario: Read project details
#     When I click on the "Automation Test Project" project
#     Then I should see the text "Automation Test Project"
# # 
#   Scenario: Update project name
#     When I click on the "Automation Test Project" project
#     And I click on the "Edit Project" button
#     Then the "Edit Project" modal should be visible
#     When I enter "Updated Automation Project" into the project name field
#     And I click on the "Save" button
#     Then I should see the text "Updated Automation Project"

#   Scenario: Delete a project
#     When I click on the "Updated Automation Project" project
#     And I click on the "Delete Project" button
#     Then the "Delete Project" modal should be visible
#     When I click on the "Confirm" button
#     Then I should be redirected to the projects page
#     And I should not see the text "Updated Automation Project" 