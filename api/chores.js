const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const ChoreSchema = new Schema(
  {
    id: Number,
    choreName: String,
    reward: Number,
    validFor: [String],
    lastEndTime: Schema.Types.Date,
    repeatDelay: Number,
    beingDoneBy: String,
    description: String
  },
  { timestamps: false, collection: "chores" }
);

autoIncrement.initialize(mongoose.connection);
ChoreSchema.plugin(autoIncrement.plugin, 'id');

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Chore", ChoreSchema);