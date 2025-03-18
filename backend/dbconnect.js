const mongoose = require("mongoose")
require("dotenv").config()

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {})
    console.log("connected to the database")
  } catch (error) {
    console.log("error connecting to the database")
  }
}

module.exports = { dbconnect }
