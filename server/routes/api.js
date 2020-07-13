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
    timeRange: req.query.time_range,
  })
  res.redirect(playlistURL)
})

router.get('/playlist/explore/v2', async (req, res) => {
  const playlistURL = await generatePlaylist.exploreTaste(req.username, {
    timeRange: req.query.time_range,
    maxRelArtists: 5,
    maxTopTracks: 3,
  })
  res.redirect(playlistURL)
})

router.get('/playlist/second', async (req, res) => {
  const playlistURL = await generatePlaylist.secondChance(req.username, {
    maxTopTracks: 3,
  })
  res.redirect(playlistURL)
})

module.exports = router
