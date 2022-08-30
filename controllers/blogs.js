const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  res.status(200).json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const body = req.body

  if (!req.user.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(req.user.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id',  userExtractor, async (req, res) => {
  // Fetch blog from database
  const blog = await Blog.findById(req.params.id)

  // Authenticate user
  if (req.user.id !== blog.user.toString()) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body

  let blog = await Blog.findById(req.params.id)
  blog.likes = likes

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true, runValidators: true, context: 'query' })
  res.json(updatedBlog)
})

module.exports = blogsRouter