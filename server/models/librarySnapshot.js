const db = require('../db')
const Schema = db.Schema

const snapshotSchema = Schema(
  {
    username: {
      type: String,
      required: true,
    },
    totalTracks: Number,
    uniqueArtists: Number,
    uniqueAlbums: Number,
    tracksPerArtist: {
      mean: Number,
      median: Number,
    },
    daysUntilSave: {
      mean: Number,
      median: Number,
    },
    totalPlaytime: Number,
    percentExplicit: Number,
    commonArtists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TopArtist',
      },
    ],
    classicArtists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TopArtist',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = db.model('LibrarySnapshot', snapshotSchema)
