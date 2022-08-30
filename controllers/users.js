const usersRouter = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1 })

  res.status(200).json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  // Ensure password is valid
  if (password.length < 3) {
    return res.status(400).json({ error: 'password must be at least 3 characters' })
  }

  // Ensure username is unique
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter