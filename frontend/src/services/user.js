import axios from "axios"
const baseUrl = "/api/user"

export const createUser = async (user) => {
  const res = await axios.post(`${baseUrl}/register`, user)
  return res.data
}

export const loginUser = async (user) => {
  const res = await axios.post(`${baseUrl}/login`, user)
  return res.data.user
}

export const getUser = async () => {
  const res = await axios.get(`${baseUrl}`)
  return res.data
}

export const logoutUser = async () => {
  const res = await axios.post(`${baseUrl}/logout`)
  return res.data
}

export const getUserBooks = async () => {
  const res = await axios.get(`${baseUrl}/books`)
  return res.data
}

export const deleteUserBook = async (bookId) => {
  await axios.delete(`/api/user/books/${bookId}`)
}
