const db = require('../db')
const Schema = db.Schema

const snapshotSchema = Schema(
  {
    username: {
      type: String,
      required: true,
    },
    totalTracks: Number,
    totalArtists: Number,
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
        artistID: { type: Schema.Types.ObjectId, ref: 'Artist' },
        trackCount: Number,
      },
    ],
    classicArtists: [
      {
        artistID: { type: Schema.Types.ObjectId, ref: 'Artist' },
        oldestYear: Number,
        newestYear: Number,
      },
    ],
    savedArtists: {
      single: [String],
      multi: [String],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = db.model('LibrarySnapshot', snapshotSchema)
