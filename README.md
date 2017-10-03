Course Rating App featuring Express and Mongo
This app is project 11 from the Treehouse
Techdegree Program.
The app stores users with courses they have taken
with corresponding course ratings.

 
## To Connect to Mongo:

Connect to the Mongod and Mongo Shell in the normal way

To Repair after un-clean shutdown:
    ./mongod --repair   
Once it is repaired run, shut down this one:
   db.shutdownServer()
Then, run it normally:
  ./mongod
Then, in new terminal start your shell:
  mongo

## Seeding the database

Uncomment out the seed code in the index.js file
Comment out the code once the database is seeded.

## Running the server

$ npm start

