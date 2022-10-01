import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'

const Blog = ({ blog, user, setNotificationMessage, setBlogs }) => {
  const [expanded, setExpanded] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [liked, setLiked] = useState(null)

  useEffect(() => {
    blog.usersWhoLiked.includes(user.id)
      ? setLiked(true)
      : setLiked(false)
  }, [blog.usersWhoLiked, user.id])

  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleLike = async () => {
    setNotificationMessage(null)
    try {
      const updatedBlog = await blogService.updateBlog(blog.id, { likes: likes + 1 })
      setLikes(updatedBlog.likes)
      setLiked(true)
      setNotificationMessage(`Liked ${blog.title}`)
      setTimeout(() => setNotificationMessage(null), 4000)
    }
    catch {
      setNotificationMessage(`Could not like ${blog.title}`)
      setTimeout(() => setNotificationMessage(null), 4000)
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove "${blog.title}"?`)) {
      try {
        await blogService.deleteBlog(blog.id)
        setNotificationMessage(`Removed ${blog.title}`)
        setTimeout(() => setNotificationMessage(null), 4000)
        const blogsAfterDelete = await blogService.getAll()
        setBlogs(blogsAfterDelete)
      } catch {
        setNotificationMessage(`Could not remove ${blog.title}`)
        setTimeout(() => setNotificationMessage(null), 4000)
      }
    }
  }

  return (
    <div className='blog-title-author' style={blogStyle}>
      {blog.title} {blog.author}
      {expanded ?
        <>
          <button onClick={toggleExpanded}>Hide</button>
          <div className='blog-url'>{blog.url}</div>
          <div className='blog-likes'>
            Likes {likes}
            {liked ?
              <button disabled>Liked</button> :
              <button className='like-button' onClick={handleLike}>Like</button>
            }
          </div>
          <div>{blog.user.name}</div>
          {blog.user.id === user.id &&
            <button id='remove-button' onClick={handleRemove}>Remove</button>
          }
        </> :
        <button className='blog-view-button' onClick={toggleExpanded}>View</button>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setNotificationMessage: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired
}

export default Blog