require("dotenv").config();

const mongoose = require("mongoose");
const Celebrity = require("../models/Celebrity");

let celebrityData = [
  {
    name: "Will Smith",
    occupation: "Actor",
    catchPhrase: "Donec non posuere nisl"
  },
  {
    name: "Jessica Chastain",
    occupation: "Actress",
    catchPhrase: "Donec faucibus pulvinar justo in vulputate"
  },
  {
    name: "Brad Pitt",
    occupation: "Actor",
    catchPhrase: "Quisque id lectus a velit dictum consectetur"
  }
]

const dbURL = process.env.DBURL;

mongoose.connect(dbURL).then( () => {

  Celebrity.collection.drop();

  Celebrity.create(celebrityData)
  .then( () => {
    console.log("Celebrities added to database");
    mongoose.disconnect();
  })

})