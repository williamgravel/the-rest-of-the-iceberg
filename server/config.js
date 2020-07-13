require('dotenv').config()

const env = process.env.NODE_ENV

const development = {
  app: {
    port: 5000,
    secret_key: process.env.SECRET_KEY,
  },
  api: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: 'http://localhost:5000/auth/spotify/callback/',
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'theRestOfTheIceberg',
  },
  env: env,
}

const production = {
  app: {
    port: parseInt(process.env.PORT),
    secret_key: process.env.SECRET_KEY,
  },
  api: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
  },
  db: {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    host: 'cluster0.3bvad.mongodb.net',
    port: 27017,
    name: 'theRestOfTheIceberg',
    options: {
      retryWrites: true,
      w: 'majority',
    },
  },
  env: env,
}

const config = {
  development,
  production,
}

module.exports = config[env]
