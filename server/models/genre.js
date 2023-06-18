import db from '../db.js'
const Schema = db.Schema

const genreSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  playlistImage: {
    type: String,
    required: true,
  },
  playlistURL: {
    type: String,
    required: true,
  },
})

export default db.model('Genre', genreSchema)
