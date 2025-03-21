const express = require("express")
const router = express.Router()
const { Listing } = require("../models/Listing")
const { User } = require("../models/User")
const { Item } = require("../models/Item")
const logger = require("../utils/logger")

router.post("/reset", async (req, res) => {
  await Listing.deleteMany({})
  await User.deleteMany({})
  await Item.deleteMany({})
  logger.info("Database reset")
  res.status(200).json({ message: "Database reset" })
})

module.exports = router
