import db from '../db.js'
const Schema = db.Schema

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: String,
    profilePic: String,
    country: String,
    accessToken: String,
    refreshToken: String,
  },
  {
    timestamps: true,
  }
)

export default db.model('User', userSchema)
