const logger = require('./logger')
const jwt = require('jsonwebtoken')

const reqLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')

  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    req.token = authorization.substring(7)
  }

  next()
}

const userExtractor = (req, res, next) => {
  const user = jwt.verify(req.token, process.env.SECRET)
  if (user) {
    req.user = user
  }

  next()
}

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })

  next()
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  //else if (error.name === 'MongoServerError') {
  //  return res.status(400).json({ error: error.message })
  //}
  else if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }
  else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }
  else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  reqLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}