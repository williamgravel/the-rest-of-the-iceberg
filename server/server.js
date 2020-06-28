// SERVER PACKAGE IMPORTS
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// CONFIG & ENVIRONMENT VARIABLES
// require('dotenv').config()
const config = require('./config')

// DATABASE IMPORT
require('./db')

// EXPRESS APP
const app = express()
const routes = require('./routes/index')

// EXPRESS MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(routes)

// APP LISTEN
app.listen(config.app.port, () => {
  console.log(`Server listening on port ${config.app.port}`)
})
