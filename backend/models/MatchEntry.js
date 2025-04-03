const mongoose = require("mongoose")

const matchEntrySchema = new mongoose.Schema({
  wanter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  haver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  listings: [
    {
      type: String,
      ref: "Listing",
    },
  ],
})

const MatchEntry = mongoose.model("MatchEntry", matchEntrySchema)
module.exports = { MatchEntry }
