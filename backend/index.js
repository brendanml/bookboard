const express = require("express")
const cors = require("cors")
const session = require("express-session")
const bcrypt = require("bcrypt")
const MongoStore = require("connect-mongo")
require("dotenv").config()

const { dbconnect } = require("./dbconnect")
const { Listing } = require("./models/Listing")
const { Item } = require("./models/Item")
const { User } = require("./models/User")
const logger = require("./utils/logger")
const axios = require("axios")
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./middleware/middleware")

dbconnect()
const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)
if (process.env.NODE_ENV === "test") {
  app.post("/api/reset", async (req, res) => {
    await Listing.deleteMany({})
    await User.deleteMany({})
    await Item.deleteMany({})
    console.log("Database reset")
    res.status(200).json({ message: "Database reset" })
  })
}
app.use(
  session({
    secret: process.env.SECRET || "your-secret-key",
    resave: false, // Avoids resaving sessions if unmodified
    saveUninitialized: false, // Avoids storing empty sessions
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions", // Collection where sessions will be stored
      ttl: 14 * 24 * 60 * 60, // Session expiration (14 days)
      autoRemove: "native", // Automatically remove expired sessions
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
  })
)

// CHANGED TO NOT THROW ERRORS.... MAYBE FIX THIS?
const validateUser = async (req, res, next) => {
  try {
    // Check if session and user exist
    if (!req.session || !req.session.user) {
      return res.status(200).json({ message: "Unauthorized: No session found" })
    }

    const { _id, password } = req.session.user

    // Find user in the database
    const findUser = await User.findById(_id)
    if (!findUser) {
      return res.status(200).json({ message: "Unauthorized: User not found" })
    }

    // Validate password
    if (password !== findUser.password) {
      return res
        .status(200)
        .json({ message: "Unauthorized: Invalid credentials" })
    }

    req.user = findUser
    next()
  } catch (error) {
    console.error("Error in validateUser middleware:", error)
    res.status(200).json({ message: "Internal server error" })
  }
}

app.post("/api/user/login", async (req, res, next) => {
  console.log(req.body)
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
    console.log(req.session)
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

app.post("/api/user/register", async (req, res, next) => {
  console.log(req.body)

  if (
    !req.body.password ||
    req.body.password.length < 8 ||
    req.body.password.length > 20 ||
    !req.body.password.match(/^[a-zA-Z0-9!]+$/)
  ) {
    return res.status(400).json({ error: "Password is required" })
  }
  console.log("password is valid")
  try {
    const existingUser = await User.findOne({ _id: req.body.email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    } else {
      console.log("...and there is not existing user")
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const newUser = await User.create({
        _id: req.body.email,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        location: req.body.postalcode,
      })
      console.log(`New user created: ${newUser}`)
      return res.status(200).json({ message: "User created", user: newUser })
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return res.status(500).json({ error: "Failed to create user" })
  }
})

app.get("/api/user/books", validateUser, async (req, res, next) => {
  const { _id } = req.user
  console.log(req.user)
  console.log("the user id is")
  console.log(_id)
  const foundBooks = await Listing.find({ owner: _id }).populate("item")
  console.log(foundBooks)
  res.status(200).json(foundBooks)
})

app.get("/api/user", validateUser, async (req, res, next) => {
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

app.post("/api/listings/create", validateUser, async (req, res, next) => {
  console.log("THE REQUEST BODY IS")
  console.log(req.body)
  const { entries } = req.body
  console.log("THE REQUEST IS")
  console.log(req.body)
  console.log("THE USER IS")
  console.log(req.user)

  if (!Array.isArray(entries)) {
    return res
      .status(400)
      .json({ error: "Invalid request format. Expected an array." })
  }

  try {
    const createdListings = []

    for (let entry of entries) {
      console.log(entry) // Make sure this logs the actual object
      let item = await Item.findOne({ title: entry.title })
      console.log("the item is:")
      console.log(item)
      if (!item) {
        item = await Item.create({
          title: entry.title,
          image: entry.image,
          type: req.body.type,
        })
      }
      const newListing = await Listing.create({
        item: item._id,
        quantity: entry.quantity,
        price: entry.price,
        description: entry.description,
        owner: req.user._id,
      })
      console.log(newListing)
      createdListings.push(newListing) // Store created listing
    }
    await User.findByIdAndUpdate(req.user._id, {
      $push: { listings: { $each: createdListings } }, // Add all listing IDs
    })

    console.log("Hitting create route")
    console.log(createdListings)
    res.status(200).json(createdListings) // Send response **once** after loop
  } catch (error) {
    console.error("Error creating listing:", error)
    res.status(500).json({ error: "Failed to create listing" })
  }
})

app.get("/api/books", async (req, res, next) => {
  const key = process.env.GOOGLE_BOOKS_API_KEY
  const url = `https://www.googleapis.com/books/v1/volumes?q=atomic&key=${key}`
  try {
    const book = await axios.get(url)
    console.log(book.data)
    res.status(200).json(book.data)
  } catch (error) {
    console.error("Error getting books:", error)
    res.status(500).json({ error: "Failed to get books" })
  }
})

app.post("/api/user/logout", (req, res, next) => {
  req.session.destroy()
  res.status(200).json({ message: "User logged out" })
})

// app.get("/", (req, res) => {
//   req.session.visited = true
//   console.log(req.session)
//   console.log(req.sessionID)
//   res.status(200).json({ message: "Session created" })
// })

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`)
})
