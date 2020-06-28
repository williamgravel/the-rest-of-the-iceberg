const express = require('express')
const router = express.Router()
const fs = require('fs')

fs.readdirSync(__dirname).forEach((route) => {
  route = route.split('.')[0]
  if (route === 'index') {
    return
  }
  router.use('/' + route, require('./' + route))
})

module.exports = router
