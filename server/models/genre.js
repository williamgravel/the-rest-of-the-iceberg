const db = require('../db')
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

module.exports = db.model('Genre', genreSchema)
