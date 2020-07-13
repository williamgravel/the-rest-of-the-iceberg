const db = require('../db')
const Schema = db.Schema

const artistSchema = Schema({
  spotifyID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  },
  spotifyURL: {
    type: String,
    required: true,
  },
})

module.exports = db.model('Artist', artistSchema)
