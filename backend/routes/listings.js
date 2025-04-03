const express = require("express")
const { Item } = require("../models/Item")
const { Listing } = require("../models/Listing")
const { User } = require("../models/User")
const logger = require("../utils/logger")
const validateUser = require("../middleware/validateUser")
const router = express.Router()

router.get("/:id", async (req, res, next) => {
  const { id } = req.params
  try {
    const foundListing = await Listing.findById(id).populate({
      path: ["item", "owner"],
    })
    console.log("Found Listing:", foundListing)
    res.status(200).json(foundListing)
  } catch (e) {
    next(e)
  }
})

module.exports = router
