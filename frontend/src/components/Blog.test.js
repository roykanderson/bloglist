import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'www.test.com',
    likes: 123,
    usersWhoLiked: [],
    user: {
      id: 123,
      username: 'testuser',
      name: 'bloggerman',
      blogs: []
    }
  }

  const user = {
    id: null
  }

  const setNotificationMessage = jest.fn()
  const setBlogs = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        user={user}
        setNotificationMessage={setNotificationMessage}
        setBlogs={setBlogs}
      />
    ).container
  })

  test('renders blog title and author, but not the url or number of likes by default', () => {
    const blogTitleAuthor = container.querySelector('.blog-title-author')
    const blogUrl = container.querySelector('.blog-url')
    const blogLikes = container.querySelector('.blog-likes')

    expect(blogTitleAuthor).toBeDefined()
    expect(blogUrl).toBeNull()
    expect(blogLikes).toBeNull()
  })

  test('blog url and likes are shown after clicking view button', async () => {
    const user = userEvent.setup()
    const viewButton = container.querySelector('.blog-view-button')

    await user.click(viewButton)

    const blogUrl = container.querySelector('.blog-url')
    const blogLikes = container.querySelector('.blog-likes')

    expect(blogUrl).toBeDefined()
    expect(blogLikes).toBeDefined()
  })

  test('event handler for like button is called twice when button is clicked twice', async () => {
    const user = userEvent.setup()

    const viewButton = container.querySelector('.blog-view-button')
    await user.click(viewButton)

    const likeButton = container.querySelector('.like-button')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeButton).toHaveTextContent('Like')
    expect(setNotificationMessage.mock.calls).toHaveLength(2)
  })
})