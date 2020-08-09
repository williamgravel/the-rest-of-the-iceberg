// PACKAGE IMPORTS
const queryString = require('query-string')
const spotify = require('./spotify')
const stats = require('simple-statistics')

// DATE MANIPULATION
const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

// DATABASE MODELS
const LibrarySnapshot = require('../models/librarySnapshot')
const Artist = require('../models/artist')

module.exports = async function (username) {
  const doc = await LibrarySnapshot.findOne({ username: username }).select('updatedAt').exec()
  if (!doc || !dayjs(doc.updatedAt.getTime(), 'x').isBetween(dayjs().subtract(7, 'd'), dayjs(), 'd', '(]')) {
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
    let queryArtists = []
    let commonArtists = []
    let classicArtists = []

    do {
      response = await spotify.get(apiURL, { headers: { 'User-ID': username } })

      for (const item of response.data.items) {
        // Track item shortcuts
        const artistID = item.track.artists[0].id
        const releaseYear = parseInt(item.track.album.release_date.substring(0, 4))
        const isCompilation = item.track.album.album_type === 'compilation'
        const isRemastered =
          item.track.album.name.toLowerCase().includes('remastered') ||
          item.track.name.toLowerCase().includes('remastered')
        let found = false

        // Insert or update unique artist entry
        for (let i = 0; i < uniqueArtists.length; i++) {
          if (uniqueArtists[i].id === artistID) {
            uniqueArtists[i].tracks += 1
            if (uniqueArtists[i].oldest > releaseYear && !(isCompilation || isRemastered)) {
              uniqueArtists[i].oldest = releaseYear
            }
            if (uniqueArtists[i].newest < releaseYear && !(isCompilation || isRemastered)) {
              uniqueArtists[i].newest = releaseYear
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

        // Keep track of days between release and save, total track playtime, and explicit track count
        if (item.track.album.release_date_precision === 'day') {
          daysUntilSave.push(dayjs(item.added_at).diff(dayjs(item.track.album.release_date, 'YYYY-MM-DD'), 'd'))
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

    uniqueArtistsByTracks.forEach((artist) => {
      queryArtists.push(artist.id)
    })

    let uniqueArtistsByGap = uniqueArtists.slice(0)
    uniqueArtistsByGap.sort((a, b) => {
      return b.newest - b.oldest - (a.newest - a.oldest)
    })
    uniqueArtistsByGap.splice(5)

    uniqueArtistsByGap.forEach((artist) => {
      queryArtists.push(artist.id)
    })

    response = await spotify.get(
      'https://api.spotify.com/v1/artists?' + queryString.stringify({ ids: queryArtists }, { arrayFormat: 'comma' }),
      { headers: { 'User-ID': username } }
    )

    for (const [index, artist] of response.data.artists.entries()) {
      const doc = await Artist.findOneAndUpdate(
        { spotifyID: artist.id },
        { name: artist.name, profilePic: artist.images[0].url, spotifyURL: artist.external_urls.spotify },
        { upsert: true, new: true }
      )
        .select('_id')
        .exec()

      if (index < 5) {
        commonArtists.push({
          artistID: doc._id,
          trackCount: uniqueArtistsByTracks[index].tracks,
        })
      } else {
        classicArtists.push({
          artistID: doc._id,
          oldestYear: uniqueArtistsByGap[index - 5].oldest,
          newestYear: uniqueArtistsByGap[index - 5].newest,
        })
      }
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

  return await LibrarySnapshot.findOne({ username: username })
    .select('-savedArtists')
    .populate('commonArtists.artistID')
    .populate('classicArtists.artistID')
    .lean()
    .exec()
}
