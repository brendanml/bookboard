const express = require("express")
const router = express.Router()
const axios = require("axios")
const { Item } = require("../models/Item")

const parseBooks = (data) => {
  if (!data || !Array.isArray(data.items)) {
    return [] // Return an empty array if no valid books are found
  }

  return data.items.map((book) => {
    const volumeInfo = book.volumeInfo || {}
    const industryIdentifiers = Array.isArray(volumeInfo.industryIdentifiers)
      ? volumeInfo.industryIdentifiers
      : []

    // Safely access ISBNs with fallback
    const isbn =
      industryIdentifiers.length > 0
        ? industryIdentifiers[0]?.identifier || book.id
        : book.id

    return {
      title: volumeInfo.title || "Unknown Title",
      isbn,
      author:
        Array.isArray(volumeInfo.authors) && volumeInfo.authors.length > 0
          ? volumeInfo.authors[0]
          : "Unknown Author",
      thumbnail: volumeInfo.imageLinks?.thumbnail || "No Image Available",
      description: volumeInfo.description || "No Description Available",
    }
  })
}
const parseBooks2 = (data) => {
  if (!data || !Array.isArray(data.items)) {
    return [] // Return an empty array if no valid books are found
  }

  return data.items.map((book) => {
    const volumeInfo = book.volumeInfo || {}
    const industryIdentifiers = Array.isArray(volumeInfo.industryIdentifiers)
      ? volumeInfo.industryIdentifiers
      : []

    // Safely access ISBNs with fallback
    const isbn =
      industryIdentifiers.length > 0
        ? industryIdentifiers[0]?.identifier || book.id
        : book.id

    return {
      title: volumeInfo.title || "Unknown Title",
      _id: isbn,
      author:
        Array.isArray(volumeInfo.authors) && volumeInfo.authors.length > 0
          ? volumeInfo.authors[0]
          : "Unknown Author",
      image: volumeInfo.imageLinks?.thumbnail || "No Image Available",
      description: volumeInfo.description || "No Description Available",
    }
  })
}

const nyt_parse = (data) => {
  // Attempt to parse the JSON data

  // Check if the expected structure exists
  if (!data?.results?.books || !Array.isArray(data.results.books)) {
    console.error("Invalid data structure: 'results.books' array not found")
    return []
  }

  // Extract the required information from each book
  return data.results.books.map((book) => {
    // Use optional chaining and nullish coalescing to safely access properties
    return {
      title: book?.title || "Unknown Title",
      _id: book?.primary_isbn13 || "N/A",
      author: book?.author || "Unknown Author",
      image: book?.book_image || "",
      description: book?.description || "No description available",
    }
  })
}

router.get("/google", async (req, res, next) => {
  try {
    const query = req.query.q
    // console.log("Query:", query)
    const key = process.env.GOOGLE_BOOKS_API_KEY
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${key}`
    const booksRes = await axios.get(url)
    const books = parseBooks(booksRes.data)
    res.status(200).json(books)
  } catch (error) {
    console.error("Error getting books:", error)
    res.status(200).json({ error: "no books avail" })
  }
})
router.get("/google/fake", async (req, res, next) => {
  try {
    const query = req.query.q
    // console.log("Query:", query)
    const key = process.env.GOOGLE_BOOKS_API_KEY
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${key}`
    const booksRes = await axios.get(url)
    const books = parseBooks2(booksRes.data)
    res.status(200).json(books)
  } catch (error) {
    console.error("Error getting books:", error)
    res.status(200).json({ error: "no books avail" })
  }
})

router.get("/nytimes", async (req, res, next) => {
  try {
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${process.env.NYTIMES_API_KEY}`
    const booksRes = await axios.get(url)
    const books = nyt_parse(booksRes.data)
    // try {
    //   await Item.insertMany(books)
    // } catch (e) {
    //   console.error("Error inserting books into database:", e)
    // }
    res.status(200).json([...books.slice(4, 6), ...books.slice(8, 14)])
  } catch (e) {
    next(e)
  }
})

router.get("/:isbn", async (req, res, next) => {
  const { isbn } = req.params
  try {
    const book = await Item.findById(isbn)
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.status(200).json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    res.status(500).json({ error: "Failed to fetch book" })
  }
})

module.exports = router
