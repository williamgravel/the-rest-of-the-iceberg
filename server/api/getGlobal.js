// PACKAGE IMPORTS
const queryString = require('query-string')
const spotify = require('./spotify')

// DATE MANIPULATION
const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

// SPOTIFY API FUNCTIONS
const analyzeTracks = require('./helper/analyzeTracks')

// DATABASE MODELS
const User = require('../models/user')
const GlobalStats = require('../models/globalStats')

module.exports = async function (username) {
  const user = await User.findOne({ username: username }).select('country').exec()
  const doc = await GlobalStats.findOne({ country: user.country }).select('updatedAt').exec()
  if (!doc || !dayjs(doc.updatedAt.getTime(), 'x').isBetween(dayjs().subtract(7, 'd'), dayjs(), 'd', '(]')) {
    const responseA = await spotify.get(
      'https://api.spotify.com/v1/browse/categories/toplists/playlists?' +
        queryString.stringify({ country: user.country }),
      { headers: { 'User-ID': username } }
    )

    const index = responseA.data.playlists.items.findIndex((playlist) => playlist.name.includes('Top 50'))

    const responseB = await spotify.get(
      `https://api.spotify.com/v1/playlists/${responseA.data.playlists.items[index].id}/tracks`,
      { headers: { 'User-ID': username } }
    )

    const audioFeatures = await analyzeTracks(
      username,
      responseB.data.items.map((item) => item.track.id)
    )

    await GlobalStats.findOneAndUpdate(
      { country: user.country },
      { audioFeatures: audioFeatures },
      { upsert: true, new: true }
    )
  }

  return await GlobalStats.findOne({ country: user.country }).lean().exec()
}
