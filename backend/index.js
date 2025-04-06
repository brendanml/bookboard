const express = require("express")
const cors = require("cors")
const sessionConfig = require("./middleware/session")
const path = require("path")
require("dotenv").config()

const { dbconnect } = require("./dbconnect")

const userRouter = require("./routes/user")
const listingRouter = require("./routes/listings")
const adminRouter = require("./routes/admin")
const testingRouter = require("./routes/testing")
const booksRouter = require("./routes/books")
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./middleware/middleware")

const app = express()
dbconnect()

app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter)
}

app.use(sessionConfig)
app.use(requestLogger)
app.use(express.static(path.join(__dirname, "dist")))

app.use("/api/user", userRouter)

app.use("/api/listings", listingRouter)

app.use("/api/admin", adminRouter)
app.use("/api/books", booksRouter)

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`)
})
