const db = require('../db')
const Schema = db.Schema

const artistSchema = Schema({
  spotifyID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  genres: [
    {
      type: String,
    },
  ],
  profilePic: {
    type: String,
    required: true,
  },
})

module.exports = db.model('TopArtist', artistSchema)
