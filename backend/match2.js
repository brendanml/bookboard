const mongoose = require("mongoose")
const { User } = require("./models/User.js")
const { Listing } = require("./models/Listing.js")
const { Item } = require("./models/Item.js")
const { Match } = require("./models/Match.js")
const { MatchEntry } = require("./models/MatchEntry.js")

require("dotenv").config()
const dbaddress = process.env.MONGODB_URI

const dbconnect = async () => {
  try {
    await mongoose.connect(dbaddress, {})
    console.log("connected to the database")
  } catch (error) {
    console.log("error connecting to the database")
  }
}

// returns dictionary of: key: item_id, value: [user_id, listing]
const createHavesDictionary = (allUsers) => {
  // console.log("all users:", allUsers)
  let haves_dict = {}
  for (let user of allUsers) {
    for (let listing of user.listings) {
      if (listing.item && listing.item._id) {
        const newHaver = {
          _id: user._id,
          email: user.email,
          listing_id: listing._id,
        }
        haves_dict[listing.item._id]
          ? haves_dict[listing.item._id].push(newHaver)
          : (haves_dict[listing.item._id] = [newHaver])
      }
    }
  }
  return haves_dict
}

const createWanterHaverDict = (allUsers, haves_dict) => {
  let wanter_haver_dict = {}
  for (let wanter of allUsers) {
    const userMatches = {}

    for (let want of wanter.wants || []) {
      //protect against undefined wants

      for (let haver of haves_dict[want] || []) {
        if (haver._id === wanter._id) continue
        userMatches[haver._id] ||= [0, []] // Initialize if not exists

        userMatches[haver._id][0] += 1
        userMatches[haver._id][1].push(haver.listing_id)
      }
    }
    wanter_haver_dict[wanter._id] = userMatches
  }
  return wanter_haver_dict
}

// key = combination of wanter and haver, contains int score and array of (wanter, haver, listings)
const createMatchDict = (wanter_haver_dict) => {
  const match_dict = {}
  for (let [wanter_id, haver] of Object.entries(wanter_haver_dict)) {
    for (let [haver_id, details] of Object.entries(haver)) {
      const listings = details[1]
      const score_to_add = details[0] || 0
      const wanter_id_string = wanter_id.toString()
      const haver_id_string = haver_id.toString()
      const matchKey =
        wanter_id_string.localeCompare(haver_id_string) < 0
          ? `${wanter_id_string}_${haver_id_string}`
          : `${haver_id_string}_${wanter_id_string}`
      match_dict[matchKey] ||= {
        score: 0,
        match_entries: [],
      }
      match_dict[matchKey].score += score_to_add
      match_dict[matchKey].match_entries.push({
        wanter: wanter_id,
        haver: haver_id,
        listings,
      })
    }
  }
  return match_dict
}

const printMatchDict = (match_dict) => {
  for (let [key, value] of Object.entries(match_dict)) {
    const { score, match_entries } = value
    console.log("Match key:", key)
    console.log("Score:", score)
    console.log("Match entries:")
    for (let entry of match_entries) {
      console.log("  Wanter:", entry.wanter)
      console.log("  Haver:", entry.haver)
      console.log("  Listings:", entry.listings)
    }
  }
}

const clearDatabaseMatches = async () => {
  try {
    await MatchEntry.deleteMany({})
    await Match.deleteMany({})
    await User.updateMany({}, { $set: { matches: [] } })
    console.log("Cleared all matches from the database")
  } catch (error) {
    console.error("Error clearing matches from the database:", error)
  }
}

const saveMatchesToDatabase = async (match_dict) => {
  for (let [matchKey, matchData] of Object.entries(match_dict)) {
    const { score, match_entries } = matchData
    const inserted_match_entries = await MatchEntry.insertMany(match_entries)
    console.log("Inserted match entries:", inserted_match_entries)
    const entry_ids = inserted_match_entries.map((entry) => entry._id)
    const created_match = await Match.create({
      score,
      match_entries: entry_ids,
    })
    await User.updateMany(
      { _id: { $in: [match_entries[0].wanter, match_entries[0].haver] } },
      { $push: { matches: created_match._id } }
    )
  }
}

const main = async () => {
  await dbconnect()
  const allUsers = await User.find({}).populate({
    path: "listings",
    populate: { path: "item" },
  })
  const haves_dict = createHavesDictionary(allUsers)
  console.log("Haves dict:", haves_dict)
  const wanter_haver_dict = createWanterHaverDict(allUsers, haves_dict)
  console.log(wanter_haver_dict)
  const match_dict = createMatchDict(wanter_haver_dict)
  printMatchDict(match_dict)
  await clearDatabaseMatches()
  await saveMatchesToDatabase(match_dict)

  // console.log("Match dict:", match_dict)
  mongoose.connection.close()
}

main()
