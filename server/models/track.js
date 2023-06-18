import db from '../db.js'
const Schema = db.Schema

const trackSchema = Schema({
  spotifyID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  albumArt: {
    type: String,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  spotifyURL: {
    type: String,
    required: true,
  },
})

export default db.model('Track', trackSchema)
