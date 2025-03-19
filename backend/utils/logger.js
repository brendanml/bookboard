const info = (...params) => {
  console.log(...params)
  // if (process.env.NODE_ENV !== "test") {
  // }
}
const error = (...params) => {
  console.error(...params)
  // if (process.env.NODE_ENV !== "test") {
  // }
}

module.exports = {
  info,
  error,
}
