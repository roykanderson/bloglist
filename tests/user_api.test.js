const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash, name: 'rooty' })

  await user.save()
})

describe('creating a user', () => {
  test('succeeds with statuscode 201 if user info is valid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'foobar',
      password: 'barfoo',
      name: 'farboo'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('content-type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)

    expect(usernames).toContain(newUser.username)
  })

  test('fails with statuscode 400 if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'fooo',
      password: 'fo',
      name: 'foobar'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(res.body.error).toBe('password must be at least 3 characters')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('fails with statuscode 400 if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      password: 'foobar',
      name: 'foobar'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(res.body.error).toBe('username must be unique')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})