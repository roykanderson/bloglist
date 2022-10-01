import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.post(baseUrl, newBlog, config)
  return res.data
}

const updateBlog = async (blogId, body) => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.put(`${baseUrl}/${blogId}`, body, config)
  return res.data
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }

  const res = await axios.delete(`${baseUrl}/${blogId}`, config)
  return res.data
}

const blogService = { setToken, getAll, createBlog, updateBlog, deleteBlog }

export default blogService