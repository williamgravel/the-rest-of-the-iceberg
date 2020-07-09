// PACKAGE IMPORTS
const queryString = require('query-string')
const spotify = require('../routes/spotify')
const moment = require('moment')
const stats = require('simple-statistics')

// DATABASE MODELS
const LibrarySnapshot = require('../models/librarySnapshot')
const Artist = require('../models/artist')

module.exports = async function (username) {
  const doc = await LibrarySnapshot.findOne({ username: username }).select('updatedAt').exec()
  if (!doc || !moment(doc.updatedAt.getTime(), 'x').isBetween(moment().subtract(7, 'd'), moment(), 'd', '(]')) {
    console.log('Requesting test')
    let apiURL =
      'https://api.spotify.com/v1/me/tracks?' +
      queryString.stringify({
        limit: 50,
        market: 'from_token',
      })

    // Temporary objects, arrays, and values
    let response = {}
    let uniqueArtists = []
    let singleArtists = new Set()
    let multiArtists = new Set()
    let trackCountArray = []
    let daysUntilSave = []
    let totalPlaytime = 0
    let totalExplicit = 0
    let queryArtists = new Set()
    let commonArtists = []
    let classicArtists = []

    // Track item shortcuts
    let artistID
    let releaseYear
    let isCompilation
    let isRemastered
    let found

    do {
      response = await spotify.get(apiURL)

      for (const item of response.data.items) {
        artistID = item.track.artists[0].id
        releaseYear = parseInt(item.track.album.release_date.substring(0, 4))
        isCompilation = item.track.album.album_type === 'compilation'
        isRemastered = item.track.album.name.toLowerCase().includes('remastered') || item.track.name.toLowerCase().includes('remastered')
        found = false

        for (let i = 0; i < uniqueArtists.length; i++) {
          if (uniqueArtists[i]['id'] === artistID) {
            uniqueArtists[i]['tracks'] += 1
            if (uniqueArtists[i]['oldest'] > releaseYear && !(isCompilation || isRemastered)) {
              uniqueArtists[i]['oldest'] = releaseYear
            }
            if (uniqueArtists[i]['newest'] < releaseYear && !(isCompilation || isRemastered)) {
              uniqueArtists[i]['newest'] = releaseYear
            }
            found = true
            break
          }
        }
        if (!found) {
          uniqueArtists.push({
            id: artistID,
            tracks: 1,
            oldest: releaseYear,
            newest: releaseYear,
          })
        }

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

    const totalTracks = response.data.total

    for (let i = 0; i < uniqueArtists.length; i++) {
      trackCountArray.push(uniqueArtists[i].tracks)
      if (uniqueArtists[i].tracks === 1) {
        singleArtists.add(uniqueArtists[i].id)
      } else {
        multiArtists.add(uniqueArtists[i].id)
      }
    }

    let uniqueArtistsByTracks = uniqueArtists.slice(0)
    uniqueArtistsByTracks.sort((a, b) => {
      return b.tracks - a.tracks
    })
    uniqueArtistsByTracks.splice(5)

    let uniqueArtistsByGap = uniqueArtists.slice(0)
    uniqueArtistsByGap.sort((a, b) => {
      return b.newest - b.oldest - (a.newest - a.oldest)
    })
    uniqueArtistsByGap.splice(5)

    for (let j = 0; j < 5; j++) {
      queryArtists.add(uniqueArtistsByTracks[j]['id'])
      queryArtists.add(uniqueArtistsByGap[j]['id'])
    }

    response = await spotify.get(
      'https://api.spotify.com/v1/artists?' + queryString.stringify({ ids: Array.from(queryArtists) }, { arrayFormat: 'comma' }),
      { headers: { 'User-ID': username } }
    )

    for (const artist of response.data.artists) {
      const doc = await Artist.findOneAndUpdate(
        { spotifyID: artist.id },
        { name: artist.name, genres: artist.genres, profilePic: artist.images[0].url },
        { upsert: true, new: true }
      )
        .select('_id')
        .exec()

      uniqueArtistsByTracks.forEach((uniqueArtist) => {
        if (uniqueArtist.id === artist.id) {
          commonArtists.push({ artistID: doc._id, trackCount: uniqueArtist.tracks })
        }
      })

      uniqueArtistsByGap.forEach((uniqueArtist) => {
        if (uniqueArtist.id === artist.id) {
          classicArtists.push({ artistID: doc._id, oldestYear: uniqueArtist.oldest, newestYear: uniqueArtist.newest })
        }
      })
    }

    await LibrarySnapshot.findOneAndUpdate(
      { username: username },
      {
        totalTracks: totalTracks,
        totalArtists: uniqueArtists.length,
        tracksPerArtist: { mean: stats.mean(trackCountArray), median: stats.median(trackCountArray) },
        daysUntilSave: { mean: stats.mean(daysUntilSave), median: stats.median(daysUntilSave) },
        totalPlaytime: totalPlaytime,
        percentExplicit: (totalExplicit / totalTracks) * 100,
        commonArtists: commonArtists,
        classicArtists: classicArtists,
        savedArtists: { single: Array.from(singleArtists), multi: Array.from(multiArtists) },
      },
      { upsert: true, new: true }
    )
  }

  return await LibrarySnapshot.findOne({ username: username }).populate('artistID').lean().exec()
}
