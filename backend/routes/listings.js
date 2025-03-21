const express = require("express")
const { Item } = require("../models/Item")
const { Listing } = require("../models/Listing")
const { User } = require("../models/User")
const logger = require("../utils/logger")
const validateUser = require("../middleware/validateUser")
const router = express.Router()

router.post("/create", validateUser, async (req, res, next) => {
  const { type, entries } = req.body
  if (!Array.isArray(entries)) {
    return res
      .status(400)
      .json({ error: "Invalid request format. Expected an array." })
  }

  console.log("Entries:", entries)
  try {
    const createdListings = []

    for (let entry of entries) {
      let item = await Item.findOne({ title: entry.title })
      if (!item) {
        item = await Item.create({
          title: entry.title,
          image: entry.image,
          type: type,
        })
      }
      console.log("Item:", item)
      const newListing = await Listing.create({
        item: item._id,
        quantity: entry.quantity,
        price: entry.price,
        description: entry.description,
        owner: req.user._id,
      })
      logger.info("New listing created:", newListing)
      createdListings.push(newListing) // Store created listing
    }
    await User.findByIdAndUpdate(req.user._id, {
      $push: { listings: { $each: createdListings } }, // Add all listing IDs
    })

    res.status(200).json(createdListings) // Send response **once** after loop
  } catch (error) {
    console.error("Error creating listing:", error)
    res.status(500).json({ error: "Failed to create listing" })
  }
})

module.exports = router
