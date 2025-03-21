const session = require("express-session")
const MongoStore = require("connect-mongo")
require("dotenv").config()

const sessionConfig = session({
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

module.exports = sessionConfig
