const mongoose = require("mongoose")
const User = require("./User")

const ItemSchema = new mongoose.Schema({
  title: String,
  type: String,
  image: String,
})

const Item = mongoose.model("Item", ItemSchema)

module.exports = { Item }
