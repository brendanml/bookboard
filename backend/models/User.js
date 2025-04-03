const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  // _id: String, //email
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: String,
  lastname: String,
  password: String,
  location: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    enum: ["CAD", "USD"],
    default: "CAD",
  },
  distancePreference: {
    type: Number,
    default: 5,
  },
  messageRequests: [
    //accepted message requests
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageRequest",
    },
  ],
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
  wants: [
    {
      type: String,
      ref: "Item",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
  ],
  exchanges: [
    //created by accepted requests, field for active or history
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange",
    },
  ],
})

const User = mongoose.model("User", UserSchema)

module.exports = { User }
