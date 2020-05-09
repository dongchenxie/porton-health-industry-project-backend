# Porton Health Industry Project Backend

## Installation
  1. Install necessary dependencies:  
     ```
     $ npm install
     ```   
  2. Configure MongoDB connection:      
     - You can use database named "test" already created with existing connection string. (skip to step 3)      
     - If you would like to create a new database:
     
       1. Modify the connection string in .env file:
          ```
          DB_CONNECTION = [your connection string ex. mongodb+srv://xxxxxxxx]
          ```
       2. Do step 4 to run the program first, it will generate a system admin account:
          
       3. You can log in the front end with the system admin account just created:
          ```
          email: admin@admin.com
          password: password
          ```       
  3. Download MongoDB Compass for database management: 
     
        https://www.mongodb.com/download-center/compass
  4. Run the program:  
     ```
     $ npm start
     ```
## ERD

![ERD](https://raw.githubusercontent.com/xdc811/porton-health-industry-project-backend/master/ERD.png)

## APIs
- Base URL: http://localhost:3333/api/
- Swagger document can be found at: http://localhost:3333/api-docs/
