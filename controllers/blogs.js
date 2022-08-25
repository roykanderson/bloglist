const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res, next) => {
  try {
    const notes = await Blog.find({})
    res.send(notes)
  }
  catch(error) {
    next(error)
  }
})

blogsRouter.post('/', async (req, res, next) => {
  const blog = new Blog(req.body)

  try {
    const result = await blog.save()
    res.status(201).json(result)
  }
  catch(error) {
    next(error)
  }
})

module.exports = blogsRouter