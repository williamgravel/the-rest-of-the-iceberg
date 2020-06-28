const db = require('../db')
const Schema = db.Schema

const trackSchema = Schema({
  spotifyID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  albumArt: {
    type: String,
    required: true,
  },
})

module.exports = db.model('TopTrack', trackSchema)
