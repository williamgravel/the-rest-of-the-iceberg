// SERVER PACKAGES IMPORTS
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// COLORFUL CONSOLE LOGS
import chalk from 'chalk'
const listening = chalk.bold.white

// CONFIG & ENVIRONMENT VARIABLES
import config from './config.js'

// DATABASE IMPORT
import './db.js'

// EXPRESS APP
const app = express()
import routes from './routes/index.js'

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
