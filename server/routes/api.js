// SERVER PACKAGES IMPORTS
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

// CONFIG & ENVIRONMENT VARIABLES
const config = require('../config')

// SPOTIFY API FUNCTIONS
const getTop = require('../scripts/getTop')
const analyzeLibrary = require('../scripts/analyzeLibrary')
const generatePlaylist = require('../scripts/generatePlaylist')

// INPUT ARGUMENTS VALIDATION
const accepted_query_types = ['artists', 'tracks']
const accepted_time_ranges = ['short_term', 'medium_term', 'long_term']

// USER AUTHENTICATION MIDDLEWARE
const userVerify = function (req, res, next) {
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, config.app.secret_key)
      req.username = decoded.username
      next()
    } catch (err) {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(401)
  }
}

router.use(userVerify)

// EXPRESS ROUTES
router.get('/top', async (req, res) => {
  if (accepted_query_types.includes(req.query.query_type) && accepted_time_ranges.includes(req.query.time_range)) {
    const topResults = await getTop(req.username, {
      queryType: req.query.query_type,
      timeRange: req.query.time_range,
    })
    res.json(topResults)
  } else {
    res.sendStatus(400)
  }
})

router.get('/library', async (req, res) => {
  const libraryResults = await analyzeLibrary(req.username)
  res.json(libraryResults)
})

router.get('/playlist/explore', async (req, res) => {
  if (accepted_time_ranges.includes(req.query.time_range)) {
    const playlistURL = await generatePlaylist.exploreSeed(req.username, req.query.time_range)
    res.redirect(playlistURL)
  } else {
    res.sendStatus(400)
  }
})

router.get('/playlist/explore/v2', async (req, res) => {
  if (accepted_time_ranges.includes(req.query.time_range)) {
    const playlistURL = await generatePlaylist.exploreTaste(req.username, {
      timeRange: req.query.time_range,
      maxRelArtists: 5,
      maxTopTracks: 3,
    })
    res.redirect(playlistURL)
  } else {
    res.sendStatus(400)
  }
})

router.get('/playlist/second', async (req, res) => {
  const playlistURL = await generatePlaylist.secondChance(req.username, {
    maxTopTracks: 3,
  })
  res.redirect(playlistURL)
})

module.exports = router
