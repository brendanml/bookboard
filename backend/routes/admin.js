const express = require("express")
const router = express.Router()

router.get("/books", async (req, res, next) => {
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

module.exports = router
