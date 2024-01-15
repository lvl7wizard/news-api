SETUP INSTRUCTIONS

In order to connect to the two databases in this project, you will need to create a .env.test and a .env.development file on the route level of this project to access the required environment variables. These have been included in the .gitignore file to emulate a common place security measure. The created files should have the following contents:

.env.test
PGDATABASE=nc_news_test
.env.development
PGDATABASE=nc_news