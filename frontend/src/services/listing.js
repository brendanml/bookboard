import axios from "axios";
const baseUrl = "/api/listings";

export const createListing = (listings) => {
  console.log("listings", listings);
  axios.post(`${baseUrl}/create`, listings).then((res) => res.data);
};
