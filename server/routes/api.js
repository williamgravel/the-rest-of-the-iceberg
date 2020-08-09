// PACKAGE IMPORTS
const express = require('express')
const router = express.Router()

// SPOTIFY API FUNCTIONS
const getTop = require('../api/getTop')
const analyzeLibrary = require('../api/analyzeLibrary')
const generatePlaylist = require('../api/generatePlaylist')

// ROUTER MIDDLEWARE
router.use(require('../middleware/verifyUser'))
router.use(require('../middleware/validateQuery'))

// EXPRESS ROUTES
router.get('/top', async (req, res) => {
  const types = ['artists', 'tracks']
  const ranges = ['short_term', 'medium_term', 'long_term']

  const options = types.flatMap((type) =>
    ranges.map((range) => {
      return { queryType: type, timeRange: range }
    })
  )

  const topResults = await Promise.all(
    options.map((option) => {
      return getTop(req.username, option)
    })
  )

  res.json({
    artists: {
      short_term: topResults[0],
      medium_term: topResults[1],
      long_term: topResults[2],
    },
    tracks: {
      short_term: topResults[3],
      medium_term: topResults[4],
      long_term: topResults[5],
    },
  })
})

router.get('/top/:queryType/:timeRange', async (req, res) => {
  const topResults = await getTop(req.username, {
    queryType: req.query.query_type,
    timeRange: req.query.time_range,
  })
  res.json(topResults)
})

router.get('/library', async (req, res) => {
  const libraryResults = await analyzeLibrary(req.username)
  res.json(libraryResults)
})

router.get('/playlist/explore', async (req, res) => {
  const playlistURL = await generatePlaylist.exploreSeed(req.username, {
    timeRange: req?.body?.timeRange || 'short_term',
  })
  res.json(playlistURL)
})

router.get('/playlist/explore/v2', async (req, res) => {
  const playlistURL = await generatePlaylist.exploreTaste(req.username, {
    timeRange: req?.body?.timeRange || 'short_term',
    maxTopArtists: req?.body?.maxTopArtists || 50,
    maxRelArtists: req?.body?.maxRelArtists || 5,
    maxTopTracks: req?.body?.maxTopTracks || 3,
  })
  res.json(playlistURL)
})

router.get('/playlist/second', async (req, res) => {
  const playlistURL = await generatePlaylist.secondChance(req.username, {
    maxSavedArtists: req?.body?.maxSavedArtists || 30,
    excludePopular: req?.body?.excludePopular || false,
    popularityThreshold: req?.body?.popularityThreshold || undefined,
    maxTopTracks: req?.body?.maxTopTracks || 3,
  })
  res.json(playlistURL)
})

module.exports = router
