const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

// this will be our data base's data structure 
const UserSchema = new Schema(
  {
    id: Number,
    name: String,
    isAdmin: Boolean,
    currentRewards: Number,
    email: String,
  },
  { timestamps: false, collection: "users" }
);


autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, 'id');
// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", UserSchema);