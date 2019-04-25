# team49

# IMPORTANT!

* DO NOT commit or push the following
  * Anything npm related (node_modules folder, .DS_Store) 
  * The mongo-data folder - it contains all the nasty database stuff and we don't want database conflicts between our local environments

# Running the mongoDB

* Make sure to have run
  * npm install
  * create a directory called mongo-data
  * installed mongoDB Community Edition
* From the directory that holds mongod.exe (wherever you installed mongoDB into)
  * mongod.exe --dbpath "C:/path/to/mongo-data"
    * The quotes are important!
    * The command may be different for Unix systems
  * You should see somewhere that it initialized and is waiting for connections on port 27017
* From the directory with server.js (the project root directory)
  * node server.js
  * You should see it run and say Listining on port 3000
* Go to your browser and view localhost:3000
  * You should see "Cannot GET /"
    * That's because we haven't implemented any routes!
    
# Notes about mongoDB

* The current version on the repo is a gutted version of E4
  * Hence the restaurants.js file in the models folder
  * Just use for reference on how to create models!
