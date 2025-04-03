const mongoose = require("mongoose")

const MatchSchema = new mongoose.Schema({
  score: {
    type: Number,
    default: 0,
  },
  match_entries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchEntry",
    },
  ],
})
const Match = mongoose.model("Match", MatchSchema)
module.exports = { Match }
