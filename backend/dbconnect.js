const mongoose = require("mongoose")
require("dotenv").config()
const dbaddress =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : process.env.MONGODB_TEST_URI

const dbconnect = async () => {
  try {
    await mongoose.connect(dbaddress, {})
    console.log("connected to the database")
  } catch (error) {
    console.log("error connecting to the database")
  }
}

module.exports = { dbconnect }
