import 'dotenv/config'

const config = {
  app: {
    port: parseInt(process.env.SERVER_PORT),
    secret_key: process.env.SECRET_KEY,
  },
  api: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  },
  db: {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    host: process.env.MONGO_HOST,
    options: {
      retryWrites: true,
      w: 'majority',
    },
  },
  env: process.env.NODE_ENV,
}

if (config.env === 'development') {
  config.api.redirect_uri = process.env.REDIRECT_URI_DEV + ':' + process.env.SERVER_PORT + '/auth/spotify/callback/'
} else if (config.env === 'production') {
  config.api.redirect_uri = process.env.REDIRECT_URI_PROD + ':' + process.env.SERVER_PORT + '/auth/spotify/callback/'
} else {

}

export default config
