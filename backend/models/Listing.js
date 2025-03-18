const mongoose = require("mongoose")
const User = require("./User")
const Item = require("./Item")

const ListingSchema = new mongoose.Schema({
  type: String,
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  quantity: Number,
  price: Number,
  description: String,
  owner: {
    type: String,
    ref: "User",
  },
  // price: Number,
  // location: String,
  // image: String
})

const Listing = mongoose.model("Listing", ListingSchema)

module.exports = { Listing }
