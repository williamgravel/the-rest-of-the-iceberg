const queryString = require('query-string')
const axios = require('axios')
const config = require('../config')

const User = require('../models/user')

module.exports = function (username, callback) {
  User.findOne({ username: username }, (err, user) => {
    if (user.updatedAt.getTime() + 3600000 > Date.now()) {
      callback(user.accessToken)
    } else {
      axios
        .post(
          'https://accounts.spotify.com/api/token',
          queryString.stringify({
            grant_type: 'refresh_token',
            refresh_token: user.refreshToken,
          }),
          {
            headers: {
              'Authorization': 'Basic ' + new Buffer.from(config.api.client_id + ':' + config.api.client_secret).toString('base64'),
            },
          }
        )
        .then((response) => {
          console.log('[AXIOS] POST REQUEST SUCCESSFUL')
          user.accessToken = response.data.access_token
          if (response.data.refresh_token) {
            user.refreshToken = response.data.refresh_token
          }
          user.save()
          callback(user.accessToken)
        })
    }
  })
}
