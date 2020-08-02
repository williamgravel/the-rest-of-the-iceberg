// PACKAGE IMPORTS
const queryString = require('query-string')
const spotify = require('./spotify')
const moment = require('moment')

// SPOTIFY API FUNCTIONS
const analyzeArtists = require('./helper/analyzeArtists')
const analyzeTracks = require('./helper/analyzeTracks')

// DATABASE MODELS
const Track = require('../models/track')
const Artist = require('../models/artist')
const TopList = require('../models/topList')

module.exports = async function (username, options) {
  const doc = await TopList.findOne({ username: username, queryType: options.queryType, timeRange: options.timeRange })
    .select('updatedAt')
    .exec()
  if (!doc || !moment(doc.updatedAt.getTime(), 'x').isBetween(moment().subtract(7, 'd'), moment(), 'd', '(]')) {
    const response = await spotify.get(
      'https://api.spotify.com/v1/me/top/' +
        options.queryType +
        '?' +
        queryString.stringify({
          limit: 10,
          time_range: options.timeRange,
        }),
      { headers: { 'User-ID': username } }
    )
    const items = response.data.items
    let list = []

    if (options.queryType === 'artists') {
      for (const item of items) {
        const doc = await Artist.findOneAndUpdate(
          { spotifyID: item.id },
          { name: item.name, profilePic: item.images[0].url, spotifyURL: item.external_urls.spotify },
          { upsert: true, new: true }
        )
          .select('_id')
          .exec()
        list.push(doc._id)
      }

      const commonGenres = await analyzeArtists(
        username,
        response.data.items.map((artist, index) => {
          let artistObj = {}
          artistObj[list[index]] = artist.genres
          return artistObj
        })
      )

      await TopList.findOneAndUpdate(
        { username: username, queryType: options.queryType, timeRange: options.timeRange, onModel: 'Artist' },
        { list: list, commonGenres: commonGenres },
        { upsert: true, new: true }
      )
    } else if (options.queryType === 'tracks') {
      for (const item of items) {
        const doc = await Track.findOneAndUpdate(
          { spotifyID: item.id },
          {
            name: item.name,
            albumArt: item.album.images[0].url,
            artistName: item.artists[0].name,
            spotifyURL: item.external_urls.spotify,
          },
          { upsert: true, new: true }
        )
          .select('_id')
          .exec()
        list.push(doc._id)
      }

      const audioFeatures = await analyzeTracks(
        username,
        response.data.items.map((track) => track.id)
      )

      await TopList.findOneAndUpdate(
        { username: username, queryType: options.queryType, timeRange: options.timeRange, onModel: 'Track' },
        { list: list, audioFeatures: audioFeatures },
        { upsert: true, new: true }
      )
    }
  }
  if (options.queryType === 'artists') {
    return await TopList.findOne({
      username: username,
      queryType: options.queryType,
      timeRange: options.timeRange,
      onModel: 'Artist',
    })
      .populate('list')
      .populate('commonGenres.genreID')
      .populate('commonGenres.artistIDs')
      .lean()
      .exec()
  } else if (options.queryType === 'tracks') {
    return await TopList.findOne({
      username: username,
      queryType: options.queryType,
      timeRange: options.timeRange,
      onModel: 'Track',
    })
      .populate('list')
      .lean()
      .exec()
  }
}
