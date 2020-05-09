# Porton Health Industry Project Backend

## Installation
  1. Install necessary dependencies:  
     ```
     $ npm install
     ```   
  2. Configure MongoDB connection:      
     - You can use database named "test" already created with existing connection string. (skip to step 3, and use the preset accounts in Development Accounts section)      
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

<h2>Development Accounts: </h2>

<h4> system admin:</h4>
<p>
email: testsys@gmail.com
</p>
<p>
password: 123456
</p>

</br>

<h4>
client admin with seeded data:
</h4>
<p>
email: w@w.com
</p>
<p>
password: password
</p>

</br>

<h4>
client admin:
</h4>
<p>
email: test123@gmail.com
</p>
<p>
password: 1234567
</p>


## APIs
- Base URL: http://localhost:3333/api/
- Swagger document can be found at: http://localhost:3333/api-docs/
