// PACKAGE IMPORTS
const queryString = require('query-string')
const spotify = require('../spotify')

// DATABASE MODELS
const Genre = require('../../models/genre')

module.exports = async function (username, artistList) {
  let uniqueGenres = []
  let commonGenres = []

  for (let i = 0; i < artistList.length; i++) {
    const artist = Object.keys(artistList[i])[0]
    const genres = Object.values(artistList[i]).flat()
    for (let j = 0; j < genres.length; j++) {
      const index = uniqueGenres.findIndex((item) => item.genre === genres[j])

      if (index > -1) {
        uniqueGenres[index].artistIDs.push(artist)
      } else {
        uniqueGenres.push({ genre: genres[j], artistIDs: [artist] })
      }
    }
  }

  uniqueGenres.sort((a, b) => {
    return b.artistIDs.length - a.artistIDs.length
  })

  uniqueGenres.splice(10)

  const responses = await Promise.all(
    uniqueGenres.map((genre) => {
      return spotify.get(
        'https://api.spotify.com/v1/search?' +
          queryString.stringify({ q: `the sound of ${genre.genre}`, type: 'playlist', limit: 5 }),
        { headers: { 'User-ID': username } }
      )
    })
  )

  for (let i = 0; i < responses.length; i++) {
    const query = responses[i].data.playlists.items
    for (let j = 0; j < query.length; j++) {
      if (query[j].owner.display_name === 'The Sounds of Spotify') {
        uniqueGenres[i].url = query[j].external_urls.spotify
        uniqueGenres[i].image = query[j].images[0].url
        break
      }
    }
  }

  for (const [index, genre] of uniqueGenres.entries()) {
    const doc = await Genre.findOneAndUpdate(
      { name: genre.genre },
      { playlistImage: genre.image, playlistURL: genre.url },
      { upsert: true, new: true }
    )
      .select('_id')
      .exec()

    commonGenres.push({ genreID: doc._id, artistIDs: uniqueGenres[index].artistIDs })
  }

  return commonGenres
}
