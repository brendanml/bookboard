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
  await axios.delete(`${baseUrl}/books/${bookId}`)
}

export const updateUserListing = async (id, updates) => {
  console.log("hitting update user listing")
  console.log("id", id)
  console.log("updates", updates)
  const res = await axios.put(`${baseUrl}/listing/${id}`, updates)
  return res.data
}

export const updateSoldListing = async (id) => {
  const res = await axios.put(`${baseUrl}/listing/${id}/sold`)
  return res.data
}

export const addWant = async (want) => {
  console.log(want)
  const res = await axios.post(`${baseUrl}/wants`, want)
  return res.data
}

export const deleteWant = async (wantId) => {
  const res = await axios.delete(`${baseUrl}/wants/${wantId}`)
  return res.data
}

export const getUserWants = async () => {
  const res = await axios.get(`${baseUrl}/wants`)
  return res.data
}

export const createUserListing = async (listings) => {
  console.log("listings", listings)
  await axios.post(`${baseUrl}/listing`, listings).then((res) => res.data)
}

export const getUserMatches = async () => {
  const res = await axios.get(`${baseUrl}/matches`)
  return res.data
}

export const updateUser = async (user) => {
  const res = await axios.put(`${baseUrl}`, user)
  return res.data
}
