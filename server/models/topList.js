const db = require('../db')
const Schema = db.Schema

const listSchema = Schema(
  {
    username: {
      type: String,
      required: true,
    },
    queryType: {
      type: String,
      required: true,
    },
    timeRange: {
      type: String,
      required: true,
    },
    list: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel',
      },
    ],
    onModel: {
      type: String,
      required: true,
      enum: ['TopArtist', 'TopTrack'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = db.model('TopList', listSchema)
