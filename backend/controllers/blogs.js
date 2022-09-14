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
  if (!blog) {
    return res.status(400).json({ error: 'blog missing or deleted' })
  }

  // Authenticate user
  if (req.user.id !== blog.user.toString()) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (req, res) => {
  const { likes } = req.body

  // Validate token
  if (!req.user.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  let blogToUpdate = await Blog.findById(req.params.id)

  // Ensure user has not already liked blog
  const user = await User.findById(req.user.id)
  if (blogToUpdate.usersWhoLiked.includes(user._id)) {
    return res.status(400).json({ error: 'cannot like a blog more than once' })
  }

  blogToUpdate.likes = likes
  blogToUpdate.usersWhoLiked = blogToUpdate.usersWhoLiked.concat(user._id)

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogToUpdate, { new: true, runValidators: true, context: 'query' })
  res.json(updatedBlog)
})

module.exports = blogsRouter