import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

describe('<CreateBlogForm />', () => {
  let container

  const blogs = []
  const setBlogs = jest.fn()
  const setNotificationMessage = jest.fn()
  const createBlogFormRef = jest.fn()

  beforeEach(() => {
    container = render(
      <CreateBlogForm
        blogs={blogs}
        setBlogs={setBlogs}
        setNotificationMessage={setNotificationMessage}
        createBlogFormRef={createBlogFormRef}
      />
    ).container
  })

  test('calls event handler received as props with correct details when new blog is created', async () => {
    const user = userEvent.setup()

    const title = container.querySelector('.input-title')
    const author = container.querySelector('.input-author')
    const url = container.querySelector('.input-url')
    const createButton = container.querySelector('.button-create-blog')

    await user.type(title, 'foo')
    await user.type(author, 'bar')
    await user.type(url, 'baz')
    await user.click(createButton)

    expect(setNotificationMessage.mock.calls.length).toBe(1)
  })
})