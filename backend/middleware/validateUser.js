const validateUser = async (req, res, next) => {
  try {
    // Check if session and user exist
    if (!req.session || !req.session.user) {
      return res.status(200).json({ message: "Unauthorized: No session found" })
    }

    const { _id, password } = req.session.user

    // Find user in the database
    const findUser = await User.findById(_id)
    if (!findUser) {
      return res.status(200).json({ message: "Unauthorized: User not found" })
    }

    // Validate password
    if (password !== findUser.password) {
      return res
        .status(200)
        .json({ message: "Unauthorized: Invalid credentials" })
    }

    req.user = findUser
    next()
  } catch (error) {
    console.error("Error in validateUser middleware:", error)
    res.status(200).json({ message: "Internal server error" })
  }
}



module.exports = validateUser
