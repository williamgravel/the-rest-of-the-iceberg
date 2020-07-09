// SERVER PACKAGES IMPORTS
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const chalk = require('chalk')
const listening = chalk.bold.white

// CONFIG & ENVIRONMENT VARIABLES
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
  console.log(listening(`[EXPRESS] SERVER LISTENING ON PORT ${config.app.port}`))
})
