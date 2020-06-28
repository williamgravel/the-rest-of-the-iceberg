const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const getTop = require('../scripts/getTop')
const checkAccess = require('../scripts/checkAccess')
const config = require('../config')

const userVerify = function (req, res, next) {
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, config.app.secret_key)
      req.username = decoded.username
      checkAccess(decoded.username, (accessToken) => {
        req.access_token = accessToken
        next()
      })
    } catch (err) {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(401)
  }
}

router.use(userVerify)

router.get('/top', async (req, res) => {
  if (req.query.query_type && req.query.time_range) {
    let topResults = await getTop(req.access_token, req.username, req.query.query_type, req.query.time_range)
    res.json(topResults)
  } else {
    res.sendStatus(400)
  }
})

module.exports = router