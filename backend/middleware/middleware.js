const logger = require("../utils/logger")

const requestLogger = (req, res, next) => {
  logger.info("Method: ", req.method)
  logger.info("Path: ", req.path)
  logger.info("Body: ", req.body)
  logger.info("Session: ", req.session)
  logger.info("----")
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" })
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" })
  }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
