const express = require("express")
const router = express.Router()
const { User } = require("../models/User")
const bcrypt = require("bcrypt")
const validateUser = require("../middleware/validateUser")
const logger = require("../utils/logger")

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findById(req.body.email)
    if (!user) {
      return res.status(400).json({ error: "User not found" })
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid password" })
    }
    req.session.user = user
    const userState = {
      email: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      location: user.location,
    }
    return res.status(200).json({ message: "User logged in", user: userState })
  } catch (error) {
    console.error("Error logging in user:", error)
    return res.status(500).json({ error: "Failed to login user" })
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
    const existingUser = await User.findOne({ _id: req.body.email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const newUser = await User.create({
        _id: req.body.email,
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
  const foundBooks = await Listing.find({ owner: _id }).populate("item")
  res.status(200).json(foundBooks)
})

router.get("/", validateUser, async (req, res, next) => {
  if (req.user) {
    const userState = {
      email: req.user._id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      location: req.user.location,
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

module.exports = router
