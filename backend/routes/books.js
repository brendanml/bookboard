const express = require("express")
const router = express.Router()
const axios = require("axios")
const { Item } = require("../models/Item")

const parseBooks = (data) => {
  if (!data || !data.items) {
    return [] // Return an empty array if no books found
  }

  return data.items.map((book) => {
    const volumeInfo = book.volumeInfo || {}
    return {
      title: volumeInfo.title || "Unknown Title",
      id: book.id,
      author:
        Array.isArray(volumeInfo.authors) && volumeInfo.authors.length > 0
          ? volumeInfo.authors[0]
          : "Unknown Author",
      thumbnail: volumeInfo.imageLinks?.thumbnail || "No Image Available",
    }
  })
}

router.get("/google", async (req, res, next) => {
  const query = req.query.q
  console.log("Query:", query)
  const key = process.env.GOOGLE_BOOKS_API_KEY
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${key}`
  try {
    const booksRes = await axios.get(url)
    const books = parseBooks(booksRes.data)
    res.status(200).json(books)
  } catch (error) {
    console.error("Error getting books:", error)
    res.status(500).json({ error: "Failed to get books" })
  }
})

module.exports = router
