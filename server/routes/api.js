// PACKAGE IMPORTS
import express from 'express'
const router = express.Router()

// SPOTIFY API FUNCTIONS
import analyzeLibrary from '../api/analyzeLibrary.js'
import getTop from '../api/getTop.js'
import getGlobal from '../api/getGlobal.js'
import * as generatePlaylist from '../api/generatePlaylist.js'

// ROUTER MIDDLEWARE
import verifyUser from '../middleware/verifyUser.js'
import validateQuery from '../middleware/validateQuery.js'

router.use(verifyUser)
router.use(validateQuery)

// EXPRESS ROUTES
router.get('/library', async (req, res) => {
  const libraryResults = await analyzeLibrary(req.username)
  res.json(libraryResults)
})

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

router.get('/global', async (req, res) => {
  const globalResults = await getGlobal(req.username)
  res.json(globalResults)
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

export default router
