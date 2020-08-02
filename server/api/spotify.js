// PACKAGE IMPORTS
const queryString = require('query-string')
const axios = require('axios').default

// CONFIG & ENVIRONMENT VARIABLES
const config = require('../config')

// CONSOLE COLORS
const chalk = require('chalk')
const warning = chalk.bold.yellow

// DATABASE MODELS
const User = require('../models/user')

// CUSTOM AXIOS INSTANCE
const spotify = axios.create()

// AXIOS INTERCEPTORS
spotify.interceptors.request.use(async (config) => {
  const username = config.headers['User-ID']
  if (username) {
    const user = await User.findOne({ username: username }).exec()
    config.headers['Authorization'] = 'Bearer ' + user.accessToken
  }
  return config
})

spotify.interceptors.response.use(null, async (error) => {
  const status = error.response ? error.response.status : null

  if (status === 429) {
    try {
      console.log(warning('[SPOTIFY] TOO MANY REQUESTS, REQUEST DELAYED...'))
      const delay = (error.response.headers['Retry-After'] + 1) * 1000
      setTimeout(() => {
        return spotify.request(error.config)
      }, delay)
    } catch (retryError) {
      return Promise.reject(retryError)
    }
  } else if (status === 401) {
    try {
      console.log(warning('[SPOTIFY] ACCESS TOKEN EXPIRED, REFRESHING...'))
      const username = error.config.headers['User-ID']
      if (!username) {
        return Promise.reject(error)
      }
      const user = await User.findOne({ username: username }).exec()

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        queryString.stringify({
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken,
        }),
        {
          headers: {
            'Authorization':
              'Basic ' + new Buffer.from(`${config.api.client_id}:${config.api.client_secret}`).toString('base64'),
          },
        }
      )
      user.accessToken = response.data.access_token
      if (response.data.refresh_token) {
        user.refreshToken = response.data.refresh_token
      }
      await user.save()

      return spotify.request(error.config)
    } catch (retryError) {
      console.log(retryError)
      return Promise.reject(retryError)
    }
  } else {
    return Promise.reject(error)
  }
})

module.exports = spotify
