import 'dotenv/config'

const config = {
  app: {
    domain: process.env.DOMAIN,
    server_port: parseInt(process.env.SERVER_PORT),
    client_port: parseInt(process.env.CLIENT_PORT),
    server_url: process.env.DOMAIN + ':' + process.env.SERVER_PORT,
    client_url: process.env.DOMAIN + ':' + process.env.CLIENT_PORT,
    secret_key: process.env.SECRET_KEY,
  },
  api: {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    redirect_uri: process.env.DOMAIN + ':' + process.env.SERVER_PORT + '/auth/spotify/callback/',
  },
  db: {
    host: process.env.MONGO_HOST,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    options: {
      retryWrites: true,
      w: 'majority',
    },
  },
  env: process.env.NODE_ENV,
}

export default config
