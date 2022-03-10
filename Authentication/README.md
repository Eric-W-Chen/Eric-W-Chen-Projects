# authentication

Setting up the database:\
Download MySQLWorkbench\
Create a new connection with localhost but be sure to test the connection to see if it works\
If it fails, you need to download MySQLCommunityServer and (for Mac) go to system preferences, and go to MySQL to start the server. The connection should work now\
\
When running the code, the first time you'll want spring.jpa.hibernate.ddl-auto=create in application.properties. This will create the database, however going further you can set it to spring.jpa.hibernate.ddl-auto=none as it will have no longer have any need to create the table.

