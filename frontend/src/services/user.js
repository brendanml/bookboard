import axios from "axios"
const baseUrl = "/api/user"

export const createUser = async (user) => {
  console.log("hitting createuser")
  console.log(user)
  const res = await axios.post(`${baseUrl}/register`, user)
  console.log("the respone is:")
  console.log(res.data)
  console.log(`the data is: ${res.data.user}`)
  return res.data
}

export const loginUser = async (user) => {
  console.log("hitting loginuser")
  const res = await axios.post(`${baseUrl}/login`, user)
  console.log("the response is:")
  console.log(res.data)
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
