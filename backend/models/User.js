const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  _id: String,
  firstname: String,
  lastname: String,
  password: String,
  location: String,
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
})

const User = mongoose.model("User", UserSchema)

module.exports = { User }
