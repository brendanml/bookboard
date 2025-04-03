const mongoose = require("mongoose")
const User = require("./User")

const ItemSchema = new mongoose.Schema({
  _id: String,
  title: String,
  type: String,
  author: String,
  image: String,
  description: String,
})

const Item = mongoose.model("Item", ItemSchema)

module.exports = { Item }
