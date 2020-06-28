const db = require('../db')
const Schema = db.Schema

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: String,
    accessToken: String,
    refreshToken: String,
  },
  {
    timestamps: true,
  }
)

module.exports = db.model('User', userSchema)
