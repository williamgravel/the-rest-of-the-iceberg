const db = require('../db')
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

module.exports = db.model('GlobalStats', globalSchema, 'globalstats')
