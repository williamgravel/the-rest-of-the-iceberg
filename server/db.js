// PACKAGE IMPORTS
const mongoose = require('mongoose')
const chalk = require('chalk')
const config = require('./config')

// CONSOLE COLORS
const connected = chalk.bold.cyan
const error = chalk.bold.yellow
const disconnected = chalk.bold.red
const terminated = chalk.bold.magenta

// MONGODB CONNECTION
mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
})

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
  mongoose.connection.close(() => {
    console.log(terminated('[MONGODB] DEFAULT CONNECTION TERMINATED'))
    process.exit(0)
  })
})

// CONNECTION EXPORT
module.exports = mongoose
