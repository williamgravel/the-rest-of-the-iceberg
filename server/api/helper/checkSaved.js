// PACKAGE IMPORTS
const queryString = require('query-string')
const spotify = require('../spotify')

// DATABASE MODELS
const LibrarySnapshot = require('../../models/librarySnapshot')

const tracks = async function (username, trackList, options) {
  try {
    let isSaved = []
    let filteredTracks = []

    for (let i = 0; i < Math.ceil(trackList.length / 50); i++) {
      const response = await spotify.get(
        'https://api.spotify.com/v1/me/tracks/contains?' +
          queryString.stringify({ ids: trackList.slice(i * 50, (i + 1) * 50) }, { arrayFormat: 'comma' }),
        { headers: { 'User-ID': username } }
      )
      isSaved.push(response.data)
    }

    await Promise.all(
      trackList.map((track, index) => {
        if (!isSaved[index]) {
          if (options.outputFormat === 'id' || !options.outputFormat) {
            filteredTracks.push(track)
          } else if (options.outputFormat === 'uri') {
            filteredTracks.push(`spotify:track:${track}`)
          }
        }
      })
    )

    return filteredTracks
  } catch (error) {
    console.log(`[SPOTIFY] UNABLE TO CHECK SAVED TRACKS (ERROR CODE ${error.response.status})`)
    return trackList
  }
}

const artists = async function (username, artistList, options) {
  try {
    let savedArtists = []
    let filteredArtists = []

    if (options.trackCount === 'single') {
      const library = await LibrarySnapshot.findOne({ username: username }).select('savedArtists.single').exec()
      savedArtists.push(library.savedArtists.single)
    } else if (options.trackCount === 'multi') {
      const library = await LibrarySnapshot.findOne({ username: username }).select('savedArtists.multi').exec()
      savedArtists.push(library.savedArtists.multi)
    } else if (options.trackCount === 'all' || !options.trackCount) {
      const library = await LibrarySnapshot.findOne({ username: username })
        .select('savedArtists.single savedArtists.multi')
        .exec()
      savedArtists.push(library.savedArtists.single)
      savedArtists.push(library.savedArtists.multi)
    }

    await Promise.all(
      artistList.map((artist) => {
        if (!savedArtists.includes(artist)) {
          if (options.outputFormat === 'id' || !options.outputFormat) {
            filteredArtists.push(artist)
          } else if (options.outputFormat === 'uri') {
            filteredArtists.push(`spotify:artist:${artist}`)
          }
        }
      })
    )

    return filteredArtists
  } catch (error) {
    console.log('[MONGODB] UNABLE TO CHECK SAVED ARTISTS')
    return artistList
  }
}

const both = async function (username, trackList, options) {
  try {
    const queryList = trackList.map((track) => track.id)
    let isTrackSaved = []

    for (let i = 0; i < Math.ceil(queryList.length / 50); i++) {
      const response = await spotify.get(
        'https://api.spotify.com/v1/me/tracks/contains?' +
          queryString.stringify({ ids: queryList.slice(i * 50, (i + 1) * 50) }, { arrayFormat: 'comma' }),
        { headers: { 'User-ID': username } }
      )
      isTrackSaved.push(response.data)
    }

    let filteredTracks = trackList.filter((track, index) => !isTrackSaved[index])

    let savedArtists = []

    if (options.trackCount === 'single') {
      const library = await LibrarySnapshot.findOne({ username: username }).select('savedArtists.single').exec()
      savedArtists.push(library.savedArtists.single)
    } else if (options.trackCount === 'multi') {
      const library = await LibrarySnapshot.findOne({ username: username }).select('savedArtists.multi').exec()
      savedArtists.push(library.savedArtists.multi)
    } else if (options.trackCount === 'all' || !options.trackCount) {
      const library = await LibrarySnapshot.findOne({ username: username })
        .select('savedArtists.single savedArtists.multi')
        .exec()
      savedArtists.push(library.savedArtists.single)
      savedArtists.push(library.savedArtists.multi)
    }

    filteredTracks = filteredTracks.filter((track) => !savedArtists.includes(track.artistID))

    if (options.outputFormat === 'id' || !options.outputFormat) {
      filteredTracks = filteredTracks.map((track) => track.id)
    } else if (options.outputFormat === 'uri') {
      filteredTracks = filteredTracks.map((track) => `spotify:track:${track.id}`)
    }

    return filteredTracks
  } catch (error) {
    console.log('UNABLE TO CHECK SAVED TRACKS/ARTISTS')
  }
}

module.exports = {
  tracks: tracks,
  artists: artists,
  both: both,
}
