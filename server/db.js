// DATABASE PACKAGE IMPORTS
import mongoose from 'mongoose'
import queryString from 'query-string'

// CONFIG & ENVIRONMENT VARIABLES
import config from './config.js'

// CONSOLE COLORS
import chalk from 'chalk'
const connected = chalk.bold.cyan
const error = chalk.bold.yellow
const disconnected = chalk.bold.red
const terminated = chalk.bold.magenta

// MONGODB CONNECTION
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(
  `mongodb+srv://${config.db.username}:${config.db.password}@${config.db.host}/?${queryString.stringify(config.db.options)}`,
  mongooseOptions
)

// CONNECTION LOGS
mongoose.connection.on('connected', () => {
  console.log(connected('[MONGODB] DEFAULT CONNECTION SUCCESSFUL'))
})

mongoose.connection.on('error', (err) => {
  console.log(error('[MONGODB] CONNECTION ERROR: ', err))
})

mongoose.connection.on('disconnected', () => {
  console.log(disconnected('[MONGODB] DEFAULT CONNECTION DISCONNECTED'))
})

process.on('SIGINT', () => {
  mongoose.connection.close().then(() => {
    console.log(terminated('[MONGODB] DEFAULT CONNECTION TERMINATED'))
    process.exit(0)
  })
})

// CONNECTION EXPORT
export default mongoose
