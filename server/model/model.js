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
    coords: [Number],
    date: String,
    time: String,
    species: String,
    location: String,
  }],
});

const Userdb = mongoose.model("userdb", schema);

module.exports = Userdb;
