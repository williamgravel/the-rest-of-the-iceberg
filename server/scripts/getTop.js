const queryString = require('query-string')
const axios = require('axios')
const moment = require('moment')

const TopTrack = require('../models/topTrack')
const TopArtist = require('../models/topArtist')
const TopList = require('../models/topList')

module.exports = async function (accessToken, username, queryType, timeRange) {
  const { updatedAt: last_request } =
    (await TopList.findOne({ username: username, queryType: queryType, timeRange: timeRange }, '-_id updatedAt').exec()) || {}
  if (!last_request || !moment(last_request.getTime(), 'x').isBetween(moment().subtract(7, 'd'), moment(), 'd', '[)')) {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/' +
        queryType +
        '?' +
        queryString.stringify({
          limit: 10,
          time_range: timeRange,
        }),
      {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      }
    )
    const items = response.data.items
    let list = []
    let modelType = ''

    if (queryType === 'artists') {
      modelType = 'TopArtist'
      await Promise.all(
        items.map(async (item) => {
          const doc = await TopArtist.findOneAndUpdate(
            { spotifyID: item.id },
            { name: item.name, genres: item.genres, profilePic: item.images[0].url },
            { upsert: true, new: true }
          )
            .select('_id')
            .exec()
          list.push(doc._id)
        })
      )
    } else if (queryType === 'tracks') {
      modelType = 'TopTrack'
      await Promise.all(
        items.map(async (item) => {
          const doc = await TopTrack.findOneAndUpdate(
            { spotifyID: item.id },
            { name: item.name, albumArt: item.album.images[0].url },
            { upsert: true, new: true }
          )
            .select('_id')
            .exec()
          list.push(doc._id)
        })
      )
    }

    await TopList.findOneAndUpdate(
      { username: username, queryType: queryType, timeRange: timeRange, onModel: modelType },
      { list: list },
      { upsert: true, new: true }
    )
  }

  if (queryType === 'artists') {
    return await TopList.findOne({ username: username, queryType: queryType, timeRange: timeRange }).populate('list').lean().exec()
  } else if (queryType === 'tracks') {
    return await TopList.findOne({ username: username, queryType: queryType, timeRange: timeRange }).populate('list').lean().exec()
  }
}
