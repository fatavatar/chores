const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Chore = require('./chores')
const User = require('./users')

// this will be our data base's data structure 
const LogSchema = new Schema(
  {
    user: User.schema,
    chore: Chore.schema,
    photo: String,
    action: String
  },
  { timestamps: true, collection: "logs" }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Log", LogSchema);