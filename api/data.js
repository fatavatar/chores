const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const Chore = new Schema(
  {
    _id: Number,
    choreName: String,
    reward: Number,
    lastEndTime: Schema.Types.Date,
    repeatDelay: Number,
    beingDoneBy: String,
    description: String
  },
  { timestamps: false, collection: "chores" }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Chore", Chore);