# Softball-Stats-Pro
A website created to facilitate tracking players stats throughout a softball season.

**Features**

**Login Page**
- Users can select any team by typing the team name

**Menu Page**
- Users can choose between three options
  - Record Game: Allows users to record game statistics
  - View Team Stats: Displays comprehensive statistics for the team
  - Return: Returns to login page in case user wants to view another team

 **Record Game Page**
 - Users can select the starting lineup from a dropdown menu that is connected to the database to display the teams players
 - Users can click on various buttons to keep track of the teams game statistics (hits, rbis, stolen bases, walks, and outs)
 - Users can submit the teams game statistics by typing the team password and clicking the submit button

**Team Stats Page**
- Users can visualize detailed statistics for each player on the team
- Users can switch between different views (table or user-friendly) to visualize the statistics

**Data Storage**
- Website utilizes Firebase Firestore database in order to store all team data including the player statistics and team password

**Getting Started**

Before you begin, ensure that you have the following requirements:

Node.js and npm installed on your development machine

1. Clone the Repository
- Extract the ZIP file to a directory of your choice

2. Navigate to the Project Directory

3. Set Up Environment Variables
- Create a .env file in the projects root directory
- Include the environment variables for your firebase firestore
  - If stuck follow this steps: https://firebase.google.com/docs/web/setup

4. Install Node.js Dependencies
- Run the command "npm install" in the projects directory

5. Start the application
- Run the command "node index.js" in the projects directory
- Open your browser and navigate to "http://localhost:3000"
