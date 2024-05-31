
# Northcoders News API 


--- NC News --- 

DESCRIPTION - a web service for displaying and updating Northcoders’ news updates, including articles, topics, comments and votes. 


1) CLONE REPOSITORY - on Github: https://github.com/GadgetGeekette/be-nc-news: Fork > Create a new fork > Create fork. From the Code dropdown copy the HTTPS URL. In a terminal enter: git clone <forked_repo_url>

2) INSTALL DEPENDENCES - install add dependencies using the CLI command: npm i 

3) SETUP LOCAL DATABASES - create two .env files: .env.test and .env.development. Add PGDATABASE=nc_news_test to the test file and PGDATABASE=nc_news to the development file. Ensure that these .env files are .gitignored. 

4) CREATE LOCAL DATABASES - run the db/setup.sql file using the CLI command: npm run setup-dbs 

5) SEED DEVELOPMENT DATABASE - run the db/run-seed.js file using the CLI command: npm run seed 

6) RUN TESTS - the test database will automatically be seeded whenever you run tests. To run all jest tests use the CLI command: npm test 

7) PRODUCTION - the hosted version can be found here: https://nc-news-6bxb.onrender.com/

8) SETUP PRODUCTION DATABASE - create a .gitignored file called .env.production and add DATABASE_URL set to the database access link on the hosted site. 

9) MINIMUM REQUIREMENTS - Node v21.7.2 and Postgres v14.11. 


--------------------------------------------------------- 
 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/) 