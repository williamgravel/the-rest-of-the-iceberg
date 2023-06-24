require('dotenv').config()

const config = {
  app: {
    domain: process.env.DOMAIN,
    server_port: parseInt(process.env.SERVER_PORT),
    client_port: parseInt(process.env.CLIENT_PORT),
    server_url: process.env.DOMAIN + ':' + process.env.SERVER_PORT,
    client_url: process.env.DOMAIN + ':' + process.env.CLIENT_PORT,
  },
  env: process.env.NODE_ENV,
}

module.exports = config
