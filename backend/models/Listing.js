const mongoose = require("mongoose")

const ListingSchema = new mongoose.Schema({
  item: {
    type: String,
    ref: "Item",
  },
  quantity: Number,
  price: Number,
  description: String,
  status: {
    type: String,
    default: "available",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const Listing = mongoose.model("Listing", ListingSchema)

module.exports = { Listing }
