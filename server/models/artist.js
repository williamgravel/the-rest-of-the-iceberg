import db from '../db.js'
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

export default db.model('Artist', artistSchema)
