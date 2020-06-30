const queryString = require('query-string')
const axios = require('axios')
const moment = require('moment')
const stats = require('simple-statistics')

const LibrarySnapshot = require('../models/librarySnapshot')
const TopArtist = require('../models/topArtist')

module.exports = async function (accessToken, username) {
  const { updatedAt: last_request } = (await LibrarySnapshot.findOne({ username: username }, '-_id updatedAt').exec()) || {}
  if (!last_request || !moment(last_request.getTime(), 'x').isBetween(moment().subtract(7, 'd'), moment(), 'd', '[)')) {
    let apiURL =
      'https://api.spotify.com/v1/me/tracks?' +
      queryString.stringify({
        limit: 50,
        market: 'from_token',
      })

    // Temporary objects, arrays, and values
    let response = {}
    let uniqueArtists = []
    let uniqueAlbums = new Set()
    let daysUntilSave = []
    let totalPlaytime = 0
    let totalExplicit = 0
    let totalTracks = 0
    let queryArtists = new Set()
    let commonArtistsSpotify = []
    let classicArtistsSpotify = []
    let commonArtistsMongo = []
    let classicArtistsMongo = []

    // Track item shortcuts
    let artistID
    let releaseYear
    let isCompilation
    let isRemastered
    let index

    do {
      response = await axios.get(apiURL, {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      })
      totalTracks = response.data.total
      for (const item of response.data.items) {
        artistID = item.track.artists[0].id
        releaseYear = parseInt(item.track.album.release_date.split('-')[0])
        isCompilation = item.track.album.album_type === 'compilation'
        isRemastered = item.track.album.name.toLowerCase().includes('remastered') || item.track.name.toLowerCase().includes('remastered')

        if (uniqueArtists.some((artist) => artist.id === artistID)) {
          index = uniqueArtists.findIndex((artist) => artist.id === artistID)
          uniqueArtists[index]['tracks'] += 1
          if (uniqueArtists[index]['oldest'] > releaseYear && !(isCompilation || isRemastered)) {
            uniqueArtists[index]['oldest'] = releaseYear
          }
          if (uniqueArtists[index]['newest'] < releaseYear && !(isCompilation || isRemastered)) {
            uniqueArtists[index]['newest'] = releaseYear
          }
        } else {
          uniqueArtists.push({
            id: artistID,
            tracks: 1,
            oldest: releaseYear,
            newest: releaseYear,
          })
        }

        uniqueAlbums.add(item.track.album.id)

        if (item.track.album.release_date_precision === 'day') {
          daysUntilSave.push(moment(item.added_at).diff(moment(item.track.album.release_date, 'YYYY-MM-DD'), 'd'))
        }
        totalPlaytime += item.track.duration_ms
        if (item.track.explicit) {
          totalExplicit += 1
        }
      }

      apiURL = response.data.next
    } while (apiURL)

    for (let i = 0; i < uniqueArtists.length; i++) {
      uniqueArtists[i]['gap'] = uniqueArtists[i]['newest'] - uniqueArtists[i]['oldest']
    }

    let uniqueArtistsByTracks = uniqueArtists.slice(0)
    uniqueArtistsByTracks.sort((a, b) => {
      return b.tracks - a.tracks
    })

    let uniqueArtistsByGap = uniqueArtists.slice(0)
    uniqueArtistsByGap.sort((a, b) => {
      return b.gap - a.gap
    })

    for (let j = 0; j < 5; j++) {
      queryArtists.add(uniqueArtistsByTracks[j]['id'])
      commonArtistsSpotify.push(uniqueArtistsByTracks[j]['id'])
    }
    for (let k = 0; k < 5; k++) {
      queryArtists.add(uniqueArtistsByGap[k]['id'])
      classicArtistsSpotify.push(uniqueArtistsByGap[k]['id'])
    }

    response = await axios.get(
      'https://api.spotify.com/v1/artists?' + queryString.stringify({ ids: Array.from(queryArtists) }, { arrayFormat: 'comma' }),
      { headers: { 'Authorization': 'Bearer ' + accessToken } }
    )

    const artists = response.data.artists
    for (const artist of artists) {
      const doc = await TopArtist.findOneAndUpdate(
        { spotifyID: artist.id },
        { name: artist.name, genres: artist.genres, profilePic: artist.images[0].url },
        { upsert: true, new: true }
      )
        .select('_id')
        .exec()

      if (commonArtistsSpotify.includes(artist.id)) {
        commonArtistsMongo.push(doc._id)
      }
      if (classicArtistsSpotify.includes(artist.id)) {
        classicArtistsMongo.push(doc._id)
      }
    }

    let trackCountArray = []
    await Promise.all(
      uniqueArtists.map(async (artist) => {
        trackCountArray.push(artist.tracks)
      })
    )

    await LibrarySnapshot.findOneAndUpdate(
      { username: username },
      {
        totalTracks: totalTracks,
        uniqueArtists: uniqueArtists.length,
        uniqueAlbums: uniqueAlbums.size,
        tracksPerArtist: { mean: stats.mean(trackCountArray), median: stats.median(trackCountArray) },
        daysUntilSave: { mean: stats.mean(daysUntilSave), median: stats.median(daysUntilSave) },
        totalPlaytime: totalPlaytime,
        percentExplicit: (totalExplicit / totalTracks) * 100,
        commonArtists: commonArtistsMongo,
        classicArtists: classicArtistsMongo,
      },
      { upsert: true, new: true }
    )
  }

  return await LibrarySnapshot.findOne({ username: username }).populate('commonArtists').populate('classicArtists').lean().exec()
}
