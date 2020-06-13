// SERVER PACKAGE IMPORTS
const express = require('express')
const cookieParser = require('cookie-parser')
const queryString = require('query-string')
const cors = require('cors')
const axios = require('axios')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

// ENVIRONMENT VARIABLES
require('dotenv').config()
const port = process.env.PORT || 5000

// DATABASE CONFIGURATION
mongoose.connect('mongodb://localhost:27017/the_rest_of_the_iceberg', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const User = require('./models/user')
User.init().then(() => {
  console.log('[MONGODB] User model initialized.')
})

// EXPRESS APP
const app = express()

// EXPRESS MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

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
app.get('/auth/spotify', (req, res) => {
  const state = generateRandomString(16)
  res.cookie(state_key, state)

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        client_id: process.env.CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.REDIRECT_URI,
        state: state,
        scope: scope,
        show_dialog: true,
      })
  )
})

app.get('/auth/spotify/callback', (req, res) => {
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
          redirect_uri: process.env.REDIRECT_URI,
        }),
        {
          headers: {
            'Authorization': 'Basic ' + new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'),
          },
        }
      )
      .then(function (response) {
        console.log('[AXIOS] POST REQUEST SUCCESSFUL')
        const access_token = response.data.access_token
        const refresh_token = response.data.refresh_token

        axios
          .get('https://api.spotify.com/v1/me', {
            headers: {
              'Authorization': 'Bearer ' + access_token,
            },
          })
          .then(function (response) {
            console.log('[AXIOS] GET REQUEST SUCCESSFUL')
            User.findOneAndUpdate(
              { username: response.data.id },
              { displayName: response.data.display_name || response.data.id, accessToken: access_token, refreshToken: refresh_token },
              { upsert: true, new: false },
              function (err, doc) {
                if (err) {
                  console.log(err)
                } else {
                  console.log('[MONGODB] USER QUERY SUCCESSFUL')
                  const token = jwt.sign(
                    {
                      username: doc.username,
                      displayName: doc.displayName,
                    },
                    process.env.SECRET_KEY
                  )

                  res.cookie('token', token, { httpOnly: true })
                  res.redirect('http://localhost:3000/')
                }
              }
            )
          })
          .catch(function (error) {
            console.log('[AXIOS] GET REQUEST ERROR')
            console.log(error)
          })
      })
      .catch(function (error) {
        console.log('[AXIOS] POST REQUEST ERROR')
        console.log(error)
      })
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
