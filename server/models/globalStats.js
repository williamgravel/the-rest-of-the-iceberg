import db from '../db.js'
const Schema = db.Schema

const globalSchema = Schema(
  {
    country: {
      type: String,
      required: true,
    },
    audioFeatures: {
      danceability: Number,
      energy: Number,
      valence: Number,
      percentAcoustic: Number,
      percentInstrumental: Number,
      percentLive: Number,
    },
  },
  {
    timestamps: true,
  }
)

export default db.model('GlobalStats', globalSchema, 'globalstats')
