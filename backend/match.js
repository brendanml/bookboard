const { User } = require("./models/User.js")
const mongoose = require("mongoose")
const { Listing } = require("./models/Listing.js")
const { Match } = require("./models/Match.js")
const { MatchEntry } = require("./models/MatchEntry.js")

require("dotenv").config()
const dbaddress = process.env.MONGODB_URI

console.log("connecting to the database")
console.log("dbaddress:", dbaddress)

const getPopulatedItems = async ({ _id }) => {
  console.log("Fetching populated listings for user with _id:", _id)
  try {
    const result = await User.findById(_id).populate("listings")
    const item_haves = []
    for (let listing of result.listings) {
      item_haves.push(listing.item)
    }
    return item_haves
  } catch (error) {
    console.error("Error fetching populated listings:", error)
    return null
  }
}

const main = async () => {
  await dbconnect()
  let haves_dict = {}
  // while (true) {
  const allUsers = await User.find({})
  for (let user of allUsers) {
    const userHaves = await getPopulatedItems(user)
    for (let have of userHaves) {
      haves_dict[have]
        ? haves_dict[have].push(user._id)
        : (haves_dict[have] = [user._id])
    }
    console.log("--------")
  }
  const match_dict = {}
  for (let user of allUsers) {
    const user_matches = {}

    for (let want of user.wants || []) {
      // Safeguard if wants is undefined
      if (haves_dict[want]) {
        for (let match_id of haves_dict[want]) {
          if (match_id === user._id) continue

          user_matches[match_id] ||= [0, []] // Initialize if not exists
          user_matches[match_id][0] += 1
          user_matches[match_id][1].push(want)
        }

        console.log("Match found for user:", user._id)
        console.log("User wants:", want)
        console.log("Users that have:", haves_dict[want])
      }
    }
    match_dict[user._id] = user_matches
  }
  console.log("Haves dict:", haves_dict)
  console.log("Match dict:", match_dict)

  let matches = {}
  for (let [wanter, havers] of Object.entries(match_dict)) {
    console.log("Wanter:", wanter)
    console.log("Havers:", havers)

    for (let haver in havers) {
      console.log("Haver:", haver)
      console.log("Has:", havers[haver])

      // Create a lexicographical match key
      const matchKey =
        wanter.localeCompare(haver) < 0
          ? `${wanter}_${haver}`
          : `${haver}_${wanter}`

      // Initialize match entry if not present
      if (!matches[matchKey]) {
        matches[matchKey] = { score: 0, details: [] }
      }

      // Update score and details
      matches[matchKey].score += havers[haver][0] // Adding the score
      matches[matchKey].details.push({
        wanter: wanter,
        haver: haver,
        items: havers[haver][1], // Assuming index 1 is a list of matches
      })

      console.log("Match key:", matches)
    }
  }
  try {
    await Match.deleteMany({})
    await MatchEntry.deleteMany({})
    await User.updateMany({}, { $set: { matches: [] } })
    console.log("Previous matches deleted successfully.")
  } catch (error) {
    console.error("Error deleting previous matches:", error)
  }

  if (!matches || typeof matches !== "object") {
    console.error("Matches data is missing or invalid.")
    return
  }

  for (let [match, details] of Object.entries(matches)) {
    console.log("Match:", match)
    console.log("Details:", details)
    console.log("******STARTING MATCH CREATION*******")

    if (!details.details || details.details.length === 0) {
      console.warn(`Skipping match ${match} due to missing details.`)
      continue
    }

    try {
      const newMatchEntries = details.details.map((detail) => ({
        wanter: detail.wanter,
        haver: detail.haver,
        items: detail.items,
      }))

      console.log("Listings found:", listings)

      const insertedEntries = await MatchEntry.insertMany(newMatchEntries)
      const entryIds = insertedEntries.map((entry) => entry._id)

      const newMatch = new Match({
        score: details.score,
        match_entries: entryIds,
      })
      await newMatch.save()

      await User.updateMany(
        { _id: { $in: [details.details[0].wanter, details.details[0].haver] } },
        { $push: { matches: { $each: [newMatch._id] } } }
      )

      console.log("Match saved:", match)
    } catch (error) {
      console.error(`Error saving match for ${match}:`, error)
    }
  }

  console.log("******ALL THE MATCHES HAVE FINISIHED********")
  // console.dir(matches, { depth: null })
  mongoose.connection.close()
}
main()

//

// dictionary of wants, // dictionary of haves
// keys are items, values are user ids

// first pass, init haves dict where keys are items people have, values are the users

// second pass:
// for each users wants
// create user match dict
// iterate over haves, storing keys as user ids that match, value being a list, containing a counter and a list of matched items
// sort....
// create matches
