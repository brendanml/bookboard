import axios from "axios"
const baseUrl = "/api/listings"

export const getListing = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`)
  console.log(res)
  return res.data
}
