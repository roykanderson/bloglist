import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import LoginForm from './components/LoginForm'
import LogoutForm from './components/LogoutForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlogFormRef = useRef()

  if (user === null) {
    return (
      <>
        <Notification message={notificationMessage} />
        <LoginForm user={user} setUser={setUser} setNotificationMessage={setNotificationMessage} />
      </>
    )
  }

  return (
    <>
      <Notification message={notificationMessage} />
      <h2>Blogs</h2>
      <LogoutForm user={user} setUser={setUser} setNotificationMessage={setNotificationMessage} />
      <Toggleable buttonLabel='Create new blog' ref={createBlogFormRef}>
        <CreateBlogForm blogs={blogs} setBlogs={setBlogs} setNotificationMessage={setNotificationMessage} createBlogFormRef={createBlogFormRef} />
      </Toggleable>
      {blogs
        .sort((a, b) => b.likes > a.likes ? 1 : -1)
        .map(blog => <Blog key={blog.id} blog={blog} user={user} setNotificationMessage={setNotificationMessage} setBlogs={setBlogs} />)
      }
    </>
  )
}

export default App