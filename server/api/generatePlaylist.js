// PACKAGE IMPORTS
const queryString = require('query-string')
const spotify = require('./spotify')

// SPOTIFY API FUNCTIONS
const checkSaved = require('./helper/checkSaved')

// DATABASE MODELS
const TopList = require('../models/topList')
const LibrarySnapshot = require('../models/librarySnapshot')

function sample(pool, k) {
  const n = pool.length

  if (k < 0 || k > n) {
    throw new RangeError('Sample larger than population or is negative')
  }

  if (n <= (k <= 5 ? 21 : 21 + Math.pow(4, Math.ceil(Math.log(k * 3, 4))))) {
    for (let i = 0; i < k; i++) {
      let j = (i + Math.random() * (n - i)) | 0
      let x = pool[i]
      pool[i] = pool[j]
      pool[j] = x
    }
    pool.length = k
    return pool
  } else {
    let selected = new Set()
    while (selected.size < k) {
      selected.add((Math.random() * n) | 0)
    }

    return Array.from(selected).map((i) => pool[i])
  }
}

const exploreSeed = async function (username, options) {
  const top = await TopList.findOne({ username: username, queryType: 'artists', timeRange: options.timeRange })
    .populate('list')
    .lean()
    .exec()
  let seedArtists = []
  let checkTracks = []
  await Promise.all(
    top.list.map((artist) => {
      seedArtists.push(artist.spotifyID)
    })
  )

  for (let i = 0; i < 2; i++) {
    const response = await spotify.get(
      'https://api.spotify.com/v1/recommendations?' +
        queryString.stringify({
          market: 'from_token',
          limit: 40,
          seed_artists: seedArtists.slice(i * 5, (i + 1) * 5),
        }),
      { headers: { 'User-ID': username } }
    )
    await Promise.all(
      response.data.tracks.map((track) => {
        checkTracks.push({ id: track.id, artistID: track.artists[0].id })
      })
    )
  }

  const filteredTracks = await checkSaved.both(username, checkTracks, { outputFormat: 'uri', trackCount: 'all' })

  const playlistRes = await spotify.post(
    `https://api.spotify.com/v1/users/${username}/playlists`,
    JSON.stringify({ name: 'Explore Your Taste by The Rest Of The Iceberg' }),
    { headers: { 'Content-Type': 'application/json', 'User-ID': username } }
  )

  await spotify.post(
    `https://api.spotify.com/v1/playlists/${playlistRes.data.id}/tracks`,
    JSON.stringify({ uris: filteredTracks }, { arrayFormat: 'comma' }),
    { headers: { 'Content-Type': 'application/json', 'User-ID': username } }
  )

  return playlistRes.data.external_urls.spotify
}

const exploreTaste = async function (username, options) {
  try {
    const top = await TopList.findOne({ username: username, queryType: 'artists', timeRange: options.timeRange })
      .populate('list')
      .lean()
      .exec()
    const topArtists = top.list.map((artist) => artist.spotifyID)
    let checkArtists = new Set()
    let checkTracks = new Set()

    const responsesA = await Promise.all(
      topArtists.map((artist) => {
        return spotify.get(`https://api.spotify.com/v1/artists/${artist}/related-artists`, {
          headers: { 'User-ID': username },
        })
      })
    )

    for (let i = 0; i < responsesA.length; i++) {
      let tempArtists = responsesA[i].data.artists.map((artist) => artist.id)
      if (tempArtists.length > options.maxRelArtists) {
        tempArtists = sample(tempArtists, options.maxRelArtists)
      }
      for (let i = 0; i < tempArtists.length; i++) {
        checkArtists.add(tempArtists[i])
      }
    }

    const relArtists = await checkSaved.artists(username, Array.from(checkArtists), {
      outputFormat: 'id',
      trackCount: 'all',
    })

    const responsesB = await Promise.all(
      relArtists.map((artist) => {
        return spotify.get(
          `https://api.spotify.com/v1/artists/${artist}/top-tracks?` + queryString.stringify({ country: 'from_token' }),
          {
            headers: { 'User-ID': username },
          }
        )
      })
    )

    for (let i = 0; i < responsesB.length; i++) {
      let tempTracks = responsesB[i].data.tracks.map((track) => track.id)
      if (tempTracks.length > options.maxTopTracks) {
        tempTracks = sample(tempTracks.slice(5), options.maxTopTracks)
      }
      for (let i = 0; i < tempTracks.length; i++) {
        checkTracks.add(tempTracks[i])
      }
    }

    const filteredTracks = await checkSaved.tracks(username, Array.from(checkTracks), { outputFormat: 'uri' })

    const playlistRes = await spotify.post(
      `https://api.spotify.com/v1/users/${username}/playlists`,
      JSON.stringify({ name: 'Explore Your Taste by The Rest Of The Iceberg' }),
      { headers: { 'Content-Type': 'application/json', 'User-ID': username } }
    )

    for (let i = 0; i < Math.ceil(filteredTracks.length / 100); i++) {
      await spotify.post(
        `https://api.spotify.com/v1/playlists/${playlistRes.data.id}/tracks`,
        JSON.stringify({ uris: filteredTracks.slice(i * 100, (i + 1) * 100) }, { arrayFormat: 'comma' }),
        { headers: { 'Content-Type': 'application/json', 'User-ID': username } }
      )
    }

    return playlistRes.data.external_urls.spotify
  } catch (error) {
    console.log(error)
  }
}

const secondChance = async function (username, options) {
  try {
    const library = await LibrarySnapshot.findOne({ username: username }).select('savedArtists.single').exec()
    const randArtists = sample(library.savedArtists.single, 30)
    let checkTracks = new Set()

    const responses = await Promise.all(
      randArtists.map((artist) => {
        return spotify.get(
          `https://api.spotify.com/v1/artists/${artist}/top-tracks?` + queryString.stringify({ country: 'from_token' }),
          {
            headers: { 'User-ID': username },
          }
        )
      })
    )

    for (let i = 0; i < responses.length; i++) {
      let tempTracks = responses[i].data.tracks.map((track) => track.id)
      if (tempTracks.length > options.maxTopTracks) {
        tempTracks = sample(tempTracks.slice(5), options.maxTopTracks)
      }
      for (let i = 0; i < tempTracks.length; i++) {
        checkTracks.add(tempTracks[i])
      }
    }

    const filteredTracks = await checkSaved.tracks(username, Array.from(checkTracks), { outputFormat: 'uri' })

    const playlistRes = await spotify.post(
      `https://api.spotify.com/v1/users/${username}/playlists`,
      JSON.stringify({ name: "Give 'Em A Second Chance by The Rest Of The Iceberg" }),
      { headers: { 'Content-Type': 'application/json', 'User-ID': username } }
    )

    for (let i = 0; i < Math.ceil(filteredTracks.length / 100); i++) {
      await spotify.post(
        `https://api.spotify.com/v1/playlists/${playlistRes.data.id}/tracks`,
        JSON.stringify({ uris: filteredTracks.slice(i * 100, (i + 1) * 100) }, { arrayFormat: 'comma' }),
        { headers: { 'Content-Type': 'application/json', 'User-ID': username } }
      )
    }

    return playlistRes.data.external_urls.spotify
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  exploreSeed: exploreSeed,
  exploreTaste: exploreTaste,
  secondChance: secondChance,
}
