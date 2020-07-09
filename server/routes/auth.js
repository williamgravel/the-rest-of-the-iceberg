// SERVER PACKAGES IMPORTS
const express = require('express')
const router = express.Router()
const queryString = require('query-string')
const axios = require('axios')
const jwt = require('jsonwebtoken')

// CONFIG & ENVIRONMENT VARIABLES
const config = require('../config')

// CONSOLE COLORS
const chalk = require('chalk')
const initalized = chalk.bold.magenta
const authorized = chalk.bold.green

// DATABASE MODELS
const User = require('../models/user')
User.on('index', (err) => {
  if (!err) {
    console.log(initalized('[MONGODB] USER MODEL INDEXED'))
  } else {
    console.log(err)
  }
})

// RANDOM STRING GENERATOR
let generateRandomString = function (length) {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// AUTHENTICATION OPTIONS
const state_key = 'spotify-auth-state'
const scope = 'user-library-read user-top-read playlist-modify-public'

// AUTHENTICATION CODE FLOW
router.get('/spotify', (req, res) => {
  const state = generateRandomString(16)
  res.cookie(state_key, state)

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        client_id: config.api.client_id,
        response_type: 'code',
        redirect_uri: config.api.redirect_uri,
        state: state,
        scope: scope,
        show_dialog: true,
      })
  )
})

router.get('/spotify/callback', (req, res) => {
  const code = req.query.code || null
  const state = req.query.state || null
  const stored_state = req.cookies ? req.cookies[state_key] : null

  if (!state || state !== stored_state) {
    res.redirect(
      'http://localhost:3000/#' +
        queryString.stringify({
          error: 'state_mismatch',
        })
    )
  } else {
    res.clearCookie(state_key)

    axios
      .post(
        'https://accounts.spotify.com/api/token',
        queryString.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: config.api.redirect_uri,
        }),
        {
          headers: {
            'Authorization': 'Basic ' + new Buffer.from(config.api.client_id + ':' + config.api.client_secret).toString('base64'),
          },
        }
      )
      .then((response) => {
        const access_token = response.data.access_token
        const refresh_token = response.data.refresh_token

        axios
          .get('https://api.spotify.com/v1/me', {
            headers: {
              'Authorization': 'Bearer ' + access_token,
            },
          })
          .then((response) => {
            User.findOneAndUpdate(
              { username: response.data.id },
              { displayName: response.data.display_name || response.data.id, accessToken: access_token, refreshToken: refresh_token },
              { upsert: true, new: true },
              function (err, doc) {
                if (err) {
                  console.log(err)
                } else {
                  const token = jwt.sign(
                    {
                      username: doc.username,
                      displayName: doc.displayName,
                    },
                    config.app.secret_key
                  )

                  console.log(authorized('[SPOTIFY] USER AUTHENTICATED'))
                  res.cookie('token', token, { httpOnly: true })
                  res.redirect('http://localhost:3000/')
                }
              }
            )
          })
          .catch((error) => {
            console.log('[AXIOS] GET REQUEST ERROR')
            console.log(error)
          })
      })
      .catch((error) => {
        console.log('[AXIOS] POST REQUEST ERROR')
        console.log(error)
      })
  }
})

module.exports = router
