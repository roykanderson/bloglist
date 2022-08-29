const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const notes = await Blog.find({})
  res.send(notes)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  const createdBlog = await blog.save()
  res.status(201).json(createdBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
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