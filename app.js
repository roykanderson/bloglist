// modules
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

// local modules
const config = require('./utils/config')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

// connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// take middleware into use
app.use(cors())
app.use(express.json())
app.use(middleware.reqLogger)
app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app