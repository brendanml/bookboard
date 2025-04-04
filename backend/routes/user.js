const express = require("express")
const router = express.Router()
const { User } = require("../models/User")
const { Listing } = require("../models/Listing")
const { Item } = require("../models/Item")
const { MatchEntry } = require("../models/MatchEntry.js")
const { Match } = require("../models/Match.js")
const bcrypt = require("bcrypt")
const validateUser = require("../middleware/validateUser")
const logger = require("../utils/logger")
const { populate } = require("dotenv")

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({ error: "User not found" })
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password)

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid password" })
    }
    req.session.user = user
    const userState = {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      location: user.location,
    }
    return res.status(200).json({ message: "User logged in", user: userState })
  } catch (error) {
    console.error("Error logging in user:", error)
    return res.status(200).json({ error: "user not logged in" })
  }
})

router.post("/register", async (req, res, next) => {
  if (
    !req.body.password ||
    req.body.password.length < 8 ||
    req.body.password.length > 20 ||
    !req.body.password.match(/^[a-zA-Z0-9!]+$/)
  ) {
    return res.status(400).json({ error: "Password is required" })
  }
  try {
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const newUser = await User.create({
        email: req.body.email,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        location: req.body.postalcode,
      })
      logger.info(`New user created: ${newUser}`)
      return res.status(200).json({ message: "User created", user: newUser })
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return res.status(500).json({ error: "Failed to create user" })
  }
})

router.get("/books", validateUser, async (req, res, next) => {
  const { _id } = req.user
  try {
    const foundBooks = await Listing.find({ owner: _id }).populate("item")
    res.status(200).json(foundBooks)
  } catch (error) {
    console.error("Error finding books:", error)
    res.status(200)
  }
  // console.log("Found books:", foundBooks)
})

router.get("/", validateUser, async (req, res, next) => {
  if (req.user) {
    const userState = {
      email: req.user.email,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      location: req.user.location,
      distancePreference: req.user.distancePreference,
    }
    return res.status(200).json(userState)
  } else {
    res.status(200).json(null)
  }
})

router.post("/logout", (req, res, next) => {
  req.session.destroy()
  res.status(200).json({ message: "User logged out" })
})

router.delete("/books/:id", validateUser, async (req, res, next) => {
  const { id } = req.params
  try {
    const deletedListing = await Listing.findByIdAndDelete(id)

    if (!deletedListing) {
      return res.status(400).json({ error: "Listing not found" })
    }

    await User.findByIdAndUpdate(deletedListing.userId, {
      $pull: { listings: id },
    })
    return res
      .status(200)
      .json({ message: "Listing deleted", listing: deletedListing })
  } catch (error) {
    console.error("Error deleting listing:", error)
    return res.status(500).json({ error: "Failed to delete listing" })
  }
})

router.post("/wants", validateUser, async (req, res, next) => {
  const { _id } = req.user
  const { title, author, image, isbn, description } = req.body

  try {
    let item = await Item.findById(isbn)
    if (!item) {
      item = await Item.create({
        _id: isbn,
        title: title,
        image: image,
        author: author,
        description: description,
      })
    }

    const foundUser = await User.findByIdAndUpdate(_id, {
      $addToSet: { wants: item._id },
    })
    console.log("Found user:", foundUser)

    res.status(200).json({ message: "Wants added" })
  } catch (e) {
    next(e)
  }
})

router.delete("/wants/:id", validateUser, async (req, res, next) => {
  const { id } = req.params
  const { _id } = req.user
  try {
    const deletedItem = await Item.findByIdAndDelete(id)
    if (!deletedItem) {
      return res.status(400).json({ error: "Item not found" })
    }
    await User.findByIdAndUpdate(_id, { $pull: { wants: id } })
    return res.status(200).json({ message: "Wants deleted" })
  } catch (error) {
    console.error("Error deleting item:", error)
    return res.status(500).json({ error: "Failed to delete item" })
  }
})

router.get("/wants", validateUser, async (req, res, next) => {
  const { _id } = req.user
  try {
    const foundUser = await User.findById(_id).populate("wants")
    res.status(200).json(foundUser.wants)
  } catch (error) {
    next(error)
  }
})

router.put("/listing/:id/sold", validateUser, async (req, res, next) => {
  const { id } = req.params
  console.log("ID:", id)
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        status: "sold",
      },
      { new: true }
    )
    res.status(200).json(updatedListing)
  } catch (error) {
    next(error)
    res.status(200).json({ message: "Listing updated" })
  }
})

router.put("/listing/:id", validateUser, async (req, res, next) => {
  const { id } = req.params
  const { quantity, price, description, status } = req.body
  console.log("ID:", id)
  console.log(
    `Quantity: ${quantity}, Price: ${price}, Description: ${description}`
  )
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        quantity: quantity,
        price: price,
        description: description,
        status: status,
      },
      { new: true }
    )
    console.log("Updated listing:", updatedListing)
    res.status(200).json(updatedListing)
  } catch (error) {
    next(error)
    res.status(200).json({ message: "Listing updated" })
  }
})

router.post("/listing", validateUser, async (req, res, next) => {
  const { type, entries } = req.body
  if (!Array.isArray(entries)) {
    return res
      .status(400)
      .json({ error: "Invalid request format. Expected an array." })
  }

  try {
    const createdListings = []

    for (let entry of entries) {
      // Skip entries with missing critical information
      if (!entry.isbn || !entry.title || !entry.image) {
        continue
      }

      // Ensure item exists in database
      let item = await Item.findById(entry.isbn)
      if (item) { //update item due to previous problems
        item.description = entry.itemDescription
        item.author = entry.author

        await item.save()
      } else if (!item) {
        item = await Item.create({
          _id: entry.isbn,
          title: entry.title,
          image: entry.image,
          type: type,
          description: entry.itemDescription,
          author: entry.author,
        })
      }

      // Find the user and their existing listings
      const userPosting = await User.findById(req.user._id).populate("listings")

      // Check if user already has a listing for this item
      const existingListing = userPosting.listings.find(
        (listing) => listing.item.toString() === item._id.toString()
      )

      let listing
      if (existingListing) {
        // Update existing listing
        listing = await Listing.findByIdAndUpdate(
          existingListing._id,
          {
            $inc: { quantity: entry.quantity }, // Increment quantity
            price: entry.price, // Update price
          },
          { new: true }
        )
      } else {
        // Create new listing
        console.log("*****", entry.status)
        listing = await Listing.create({
          item: item._id,
          quantity: entry.quantity,
          price: entry.price,
          description: entry.description,
          owner: req.user._id,
          status: entry.status,
        })

        // Add new listing to user's listings
        await User.findByIdAndUpdate(req.user._id, {
          $push: { listings: listing._id },
        })

        createdListings.push(listing)
      }
    }

    res.status(200).json(createdListings)
  } catch (error) {
    console.error("Error creating listing:", error)
    res.status(500).json({ error: "Failed to create listing" })
  }
})

router.put("/", validateUser, async (req, res, next) => {
  const { _id } = req.user
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        location: req.body.location,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        distancePreference: req.body.distancePreference,
      },
      { new: true }
    )
    console.log("Updated user:", updatedUser)
    res.status(200).json(updatedUser)
  } catch (e) {
    next(e)
  }
})

router.get("/matches", validateUser, async (req, res, next) => {
  const { _id } = req.user
  console.log(_id)
  try {
    const user = await User.findById(_id).populate({
      path: "matches",
      populate: {
        path: "match_entries", // This correctly populates match_entries inside matches
        populate: [
          { path: "listings", populate: { path: "item" } },
          "haver",
          "wanter",
        ], // This populates items inside match_entries
      },
    })
    let return_matches = []
    const this_user_id = user._id.toString()
    for (let match of user.matches) {
      let match_dict = {}
      const first_haver = match.match_entries[0].haver
      const first_wanter = match.match_entries[0].wanter
      if (first_wanter._id.toString() === this_user_id) {
        match_dict.other_user = {
          id: first_haver._id,
          firstname: first_haver.firstname,
          lastname: first_haver.lastname,
          location: first_haver.location,
        }
      } else if (first_haver._id.toString() === this_user_id) {
        match_dict.other_user = {
          id: first_wanter._id,
          firstname: first_wanter.firstname,
          lastname: first_wanter.lastname,
          location: first_wanter.location,
        }
      }

      for (let match_entry of match.match_entries) {
        if (match_entry.wanter._id.toString() === this_user_id) {
          match_dict.your_wants = match_entry.listings
        } else if (match_entry.haver._id.toString() === this_user_id) {
          match_dict.your_haves = match_entry.listings
        }
      }
      match_dict.score = match.score
      match_dict.match_id = match._id
      return_matches.push(match_dict)
    }

    return_matches.sort((a, b) => {
      return b.score - a.score
    })
    console.log("Return matches:", return_matches)

    res.status(200).json(return_matches)
  } catch (e) {
    res.status(400)
  }
})

module.exports = router
