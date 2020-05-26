if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const http = require('http')
const url = require('url')
const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')

// redis
const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const helmet = require('helmet')
const cors = require('cors')

const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

// setting server
const server = http.createServer(app)

// load routers
const user = require('./interface/User')

// connect to mongoDB
const db = process.env.MONGODB_CONNECT
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB...')
  })
  .catch(e => {
    console.log(e)
  })

// use helmet
app.use(helmet())
// cors
app.use(cors())

// bodyparser middleware (use form submit)
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())

// sesseion config
let redisClient
if (process.env.REDIS_URL) {
  let rtg = url.parse(process.env.REDIS_URL)
  redisClient = redis.createClient(rtg.port, rtg.hostname, {
    no_ready_check: true
  })
  redisClient.auth(rtg.auth.split(':')[1])
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: false,
      // 將session存到Redis
      store: new RedisStore({
        client: redisClient,
        host: rtg.hostname
      })
    })
  )
} else {
  redisClient = redis.createClient()
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: false,
      // 將session存到Redis
      store: new RedisStore({
        client: redisClient
      })
    })
  )
}

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
// Passport config
require('./interface/utils/passport.config.js')(passport)

// 掛載router
app.use(user)

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
