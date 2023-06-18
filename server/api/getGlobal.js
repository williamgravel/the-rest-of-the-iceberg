// PACKAGE IMPORTS
import queryString from 'query-string'
import spotify from './spotify.js'

// DATE MANIPULATION
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
dayjs.extend(isBetween)

// SPOTIFY API FUNCTIONS
import analyzeTracks from './helper/analyzeTracks.js'

// DATABASE MODELS
import User from '../models/user.js'
import GlobalStats from '../models/globalStats.js'

export default async function (username) {
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
