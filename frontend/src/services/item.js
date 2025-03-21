import axios from "axios"

export const getItemSuggestions = async ({ type, query }) => {
  const queryNoWhitespace = query.replace(/\s/g, "+")
  const data =
    type === "book-option"
      ? await getBookSuggestions(queryNoWhitespace)
      : await getBoardgameSuggestions(queryNoWhitespace)
  return data
}

const getBookSuggestions = async (query) => {
  const { data } = await axios.get(`/api/books/google?q=${query}`)
  return data
}

const getBoardgameSuggestions = async (query) => {
  const { data } = await axios.get(`/api/boardgames/bgg?q=${query}`)
  return data
}
