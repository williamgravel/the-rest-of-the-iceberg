// PACKAGE IMPORTS
const queryString = require('query-string')
const axios = require('axios')
const moment = require('moment')

// SPOTIFY API FUNCTIONS
const analyzeTracks = require('./analyzeTracks')

// DATABASE MODELS
const Track = require('../models/track')
const Artist = require('../models/artist')
const TopList = require('../models/topList')

module.exports = async function (username, options) {
  const doc = await TopList.findOne({ username: username }).select('updatedAt').exec()
  if (!doc || !moment(doc.updatedAt.getTime(), 'x').isBetween(moment().subtract(7, 'd'), moment(), 'd', '(]')) {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/' +
        options.queryType +
        '?' +
        queryString.stringify({
          limit: 50,
          time_range: options.timeRange,
        }),
      { headers: { 'User-ID': username } }
    )
    const items = response.data.items.slice(10)
    let list = []
    let modelType = ''

    if (options.queryType === 'artists') {
      modelType = 'Artist'
      for (const item of items) {
        const doc = await Artist.findOneAndUpdate(
          { spotifyID: item.id },
          { name: item.name, genres: item.genres, profilePic: item.images[0].url },
          { upsert: true, new: true }
        )
          .select('_id')
          .exec()
        list.push(doc._id)
      }
    } else if (options.queryType === 'tracks') {
      modelType = 'Track'
      for (const item of items) {
        const doc = await Track.findOneAndUpdate(
          { spotifyID: item.id },
          { name: item.name, albumArt: item.album.images[0].url },
          { upsert: true, new: true }
        )
          .select('_id')
          .exec()
        list.push(doc._id)
      }
    }

    if (options.queryType === 'tracks' && options.updateAudioFeatures === true) {
      const audioFeatures = analyzeTracks(
        username,
        response.data.items.map((track) => track.id)
      )

      await TopList.findOneAndUpdate(
        { username: username, queryType: options.queryType, timeRange: options.timeRange, onModel: modelType },
        { list: list, audioFeatures: audioFeatures },
        { upsert: true, new: true }
      )
    } else {
      await TopList.findOneAndUpdate(
        { username: username, queryType: options.queryType, timeRange: options.timeRange, onModel: modelType },
        { list: list },
        { upsert: true, new: true }
      )
    }
  }

  if (options.queryType === 'artists') {
    return await TopList.findOne({ username: username, queryType: options.queryType, timeRange: options.timeRange })
      .populate('list')
      .lean()
      .exec()
  } else if (options.queryType === 'tracks') {
    return await TopList.findOne({ username: username, queryType: options.queryType, timeRange: options.timeRange })
      .populate('list')
      .lean()
      .exec()
  }
}
