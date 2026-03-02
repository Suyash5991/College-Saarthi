const mongoose = require("mongoose");

const cutoffSchema = new mongoose.Schema({
  institute: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  quota: String,
  seatType: String,
  gender: String,
  openingRank: Number,
  closingRank: Number,
  round: Number,
  year: Number
});

module.exports = mongoose.model("Cutoff", cutoffSchema);