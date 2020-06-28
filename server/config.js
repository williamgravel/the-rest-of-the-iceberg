require('dotenv').config()

const config = {
  app: {
    port: parseInt(process.env.PORT) || 5000,
    secret_key: process.env.SECRET_KEY,
  },
  api: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI || 'http://localhost:5000/auth/spotify/callback/',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 27017,
    name: process.env.DB_NAME || 'theRestOfTheIceberg',
  },
}

module.exports = config
