const mongoose = require("mongoose")
const { User } = require("./models/User")
const { Listing } = require("./models/Listing")
require("dotenv").config()

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {})
    console.log("connected to the database")
    await Listing.deleteMany({})
    await User.deleteMany({})
    console.log("deleted all listings")
  } catch (error) {
    console.log("error connecting to the database")
  } finally {
    mongoose.connection.close()
  }
}

reset()
