const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash, name: 'rooty' })

  await user.save()
})

describe('when there are some notes saved intially', () => {
  test('blogs are returned as json', async () => {
    const res = await api.get('/api/blogs')

    // Correct content-type returned
    expect(res.headers['content-type']).toMatch(/application\/json/)
  })

  test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')

    // Correct number of blogs returned
    expect(res.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of blogs is named id', async () => {
    const res = await api.get('/api/blogs')

    // 'id' field exists
    expect(res.body[0].id).toBeDefined()
  })
})

describe('adding a blog', () => {
  test('a valid blog can be added', async () => {
    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200)

    const token = loginRes.body.token

    const newBlog = {
      title: 'Test',
      author: 'John Doe',
      url: 'https://test.com',
      likes: 0
    }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)

    // Correct content-type returned
    expect(res.headers['content-type']).toMatch(/application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    // Number of blogs increased by one
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.title)

    // Content saved correctly
    expect(contents).toContain('Test')
  })

  // Exercise 4.11
  test('likes are 0 if likes property is not included in request', async () => {
    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200)

    const token = loginRes.body.token

    const newBlog = {
      title: 'Test',
      author: 'Ed Eddy',
      url: 'https://test.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()

    // Likes of the blog just added are 0
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  // Exercise 4.12
  test('blogs with missing title or url are not added', async () => {
    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200)

    const token = loginRes.body.token

    const noTitleBlog = {
      author: 'John Doe',
      url: 'https://test.com',
      likes: 2
    }

    const noUrlBlog = {
      title: 'Test',
      author: 'John Doe',
      likes: 3
    }

    const res1 = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(noTitleBlog)

    const res2 = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(noUrlBlog)

    const blogsAtEnd = await helper.blogsInDb()

    // The blogs were not added
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)

    // Response statuses are 400
    expect(res1.status).toBe(400)
    expect(res2.status).toBe(400)
  })
})

describe('deleting a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200)

    const token = loginRes.body.token

    const newBlog = {
      title: 'Test',
      author: 'John Doe',
      url: 'https://test.com',
      likes: 0
    }

    const addedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)

    expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length + 1)

    await api
      .delete(`/api/blogs/${addedBlog.body.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const urls = blogsAtEnd.map(blog => blog.url)
    expect(urls).not.toContain(addedBlog.body.url)
  })
})

describe('updating a blog', () => {
  test('succeeds if id and data are valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const blogToUpdateId = blogToUpdate.id
    const likesAtStart = blogToUpdate.likes
    blogToUpdate.likes += 1

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = await Blog.findById(blogToUpdateId)

    expect(updatedBlog.likes).toBe(likesAtStart + 1)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes += 1

    await api
      .put('/api/blogs/invalidId')
      .send(blogToUpdate)
      .expect(400)
  })
})

afterAll(async () => {
  await Blog.deleteMany({})
  mongoose.connection.close()
})