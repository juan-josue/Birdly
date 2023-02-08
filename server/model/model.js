const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  sightings: [{
    date: String,
    time: String,
    species: String,
    location: String,
    coords: [Number],
  }],
});

const Userdb = mongoose.model("userdb", schema);

module.exports = Userdb;
