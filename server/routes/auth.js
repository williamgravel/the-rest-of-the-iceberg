// SERVER PACKAGES IMPORTS
import express from 'express'
const router = express.Router()
import queryString from 'query-string'
import axios from 'axios'
import jwt from 'jsonwebtoken'

// CONFIG & ENVIRONMENT VARIABLES
import config from '../config.js'

// CONSOLE COLORS
import chalk from 'chalk'
const initalized = chalk.bold.magenta
const authorized = chalk.bold.green

// DATABASE MODELS
import User from '../models/user.js'
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
const scope = 'user-read-private user-library-read user-top-read playlist-modify-public'

// AUTHENTICATION CODE FLOW
router.get('/spotify/login', (req, res) => {
  const state = generateRandomString(16)
  res.cookie(state_key, state)

  res.json({
    redirect:
      'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        client_id: config.api.client_id,
        response_type: 'code',
        redirect_uri: config.api.redirect_uri,
        state: state,
        scope: scope,
        show_dialog: true,
      }),
  })
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
            'Authorization':
              'Basic ' + new Buffer.from(config.api.client_id + ':' + config.api.client_secret).toString('base64'),
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
              {
                displayName: response.data.display_name || response.data.id,
                profilePic: response.data.images[0].url,
                country: response.data.country,
                accessToken: access_token,
                refreshToken: refresh_token,
              },
              { upsert: true, new: true }
            ).then(doc => {
              const token = jwt.sign({ username: doc.username }, config.app.secret_key)

              console.log(authorized('[SPOTIFY] USER AUTHENTICATED'))
              res.cookie('token', token, { httpOnly: true })
              res.cookie('auth', true)
              res.redirect('http://localhost:3000/')
            }).catch(err => {
              console.log(err)
            })
          })
          .catch((error) => {
            console.log('[AXIOS] GET REQUEST ERROR')
            console.log(error)
          })
      })
      .catch((error) => {
        console.log('[AXIOS] POST REQUEST ERROR')
        console.log(error)
        res.redirect('http://localhost:3000/')
      })
  }
})

router.get('/spotify/logout', (req, res) => {
  res.clearCookie('token')
  res.clearCookie('auth')
  res.sendStatus(200)
})

export default router
