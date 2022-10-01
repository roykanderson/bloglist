import { useState } from 'react'

import blogService from '../services/blogs'

const CreateBlogForm = ({ blogs, setBlogs, setNotificationMessage, createBlogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    setNotificationMessage(null)

    const newBlog = { title, author, url }

    try {
      const savedBlog = await blogService.createBlog(newBlog)
      setBlogs(blogs.concat(savedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      createBlogFormRef()
      setNotificationMessage(`${savedBlog.title} by ${savedBlog.author} added!`)
      setTimeout(() => setNotificationMessage(null), 3000)
    } catch {
      setNotificationMessage('Failed to create blog')
      setTimeout(() => setNotificationMessage(null), 3000)
    }
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          Title:
          <input id='title' className='input-title' type="text" value={title} name="Title" onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          Author:
          <input id='author' className='input-author' type="text" value={author} name="Author" onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          URL:
          <input id='url' className='input-url' type="text" value={url} name="URL" onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button id='create-blog-button' className='button-create-blog' type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm