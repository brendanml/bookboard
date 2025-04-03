import axios from "axios"

export const getItemSuggestions = async ({ type, query }) => {
  const queryNoWhitespace = query.replace(/\s/g, "+")
  const data =
    type === "book-option"
      ? await getBookSuggestions(queryNoWhitespace)
      : await getBoardgameSuggestions(queryNoWhitespace)
  return data
}

export const getNYTBestSellers = async (query) => {
  const { data } = await axios.get(`/api/books/nytimes`)
  return data
}

const getBookSuggestions = async (query) => {
  console.log("Querying Google Books API for:", query)
  const { data } = await axios.get(`/api/books/google?q=${query}`)
  return data
}

const getBoardgameSuggestions = async (query) => {
  const { data } = await axios.get(`/api/boardgames/bgg?q=${query}`)
  return data
}

export const getItem = async (itemId) => {
  const { data } = await axios.get(`/api/books/${itemId}`)
  return data
}
