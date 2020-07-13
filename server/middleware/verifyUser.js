// PACKAGE IMPORTS
const jwt = require('jsonwebtoken')

// CONFIG & ENVIRONMENT VARIABLES
const config = require('../config')

module.exports = function (req, res, next) {
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, config.app.secret_key)
      req.username = decoded.username
      next()
    } catch (err) {
      res.status(403).send({ error: 'Invalid client token, unable to authorize user' })
    }
  } else {
    res.status(401).send({ error: 'Missing client token, unable to authenticate user' })
  }
}