Task# 001
Stack Requirements:
• Node.js v22/ ExpressJS
• Angular v19 /Angular Material
• MongoDB
Initial/Setup:
• Create a backend Node.js/ExpressJS Server
• Servershould be running on Port 3000 Create a folder:
o controllers/
o routes/
o helpers/
o models/
• app.js file should contain all the initializations
• Create an Angular App with Angular Material
• The app should be configured to run on port 4200
Objective:
• We want to connect to GitHub via API using OAuth (2) authentication.
• Documentation: https://docs.github.com/en/rest?apiVersion=2022-11-28.
• We want to build the Authentication using OAuth 2.
• In the Angular Application, create a routing and modules for integration.
• Create componentsfor the integration.
• When the Connect button is clicked, we will redirect the user to GitHub for
Authentication using OAuth (2)
• After the successful integration, we display the successstatus.
• We will store the authentication details in a MongoDB DB integrations and
collection: github-integration
• When we refresh the page, if we have already connected the page should
have the green checkmark and it should display the date when the
integration was connected.
• Store the information of the user who authenticated.
• When we expand the Mat Panel, we should have the following options:
o Remove Integration
• When the Remove button is clicked, it will remove the connection and delete
it from the database.
• We should be able to reconnect, if required.
• We need to fetch the following data from github:
- organizations
- organizations/repos
- organizations/repos/commits
- organizations/repos/pulls
- organizations/repos/issues
- organizations/repos/issues/changelogs
- organizations/users
• We need to ensure we are fetching all the data.
• For testing purposes, ensure you have atleast 1 organizations within your
github account.
• Within your testing organization, make sure you have atleast 3 repos and
each repo should have atleast: 2000 commits, 1000 pulls, 500 issues. You can
import public open source libraries into your test repo as well.
• We will store the above data into their separate collection in the database.
• We need the ability to view all the github data.
Active Integrations Dropdown: Github
Entity Dropdown: List of Collections in the GitHub database.
Search: Ability to search keyword in the AG Grid.
AG Grid Table will display all the fields from the collection. It will get the fields
dynamically from the selected collection and display them in the AG Grid.
Some additional requirements:
- Utilize the maximum real estate
- All columns should support filters
- Each field in the collection should be a separate field and a separate column.
- Search should apply search in all the columns.
- Implement Pagination.
Testing Tips:
• Create a GitHub account for testing purposes.
• Import Open source/Public Repos.
• Connect the testing account to make sure the authentication is working
properly.
• AG Grid filters are working properly. All the fields/columns are displayed
correctly.
