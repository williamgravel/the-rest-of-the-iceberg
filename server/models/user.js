const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: String,
    createdAt: Date,
    updatedAt: Date,
    accessToken: String,
    refreshToken: String,
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', function (next) {
  let now = Date.now()

  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }

  next()
})

userSchema.plugin(findOrCreate)

module.exports = mongoose.model('User', userSchema)
