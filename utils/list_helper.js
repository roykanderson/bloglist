const totalLikes = blogs => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) return null
  return blogs.reduce((acc, cur) => cur.likes > acc.likes ? cur : acc)
}

const mostBlogs = blogs => {
  if (blogs.length === 0) return null

  const blogsPerAuthor = {}
  for (const blog of blogs) {
    if (blog.author in blogsPerAuthor) {
      blogsPerAuthor[blog.author] += 1
    }
    else {
      blogsPerAuthor[blog.author] = 1
    }
  }

  let mostBlogs = { author: 'none', blogs: 0 }
  for (const author of Object.keys(blogsPerAuthor)) {
    if (blogsPerAuthor[author] > mostBlogs.blogs) {
      mostBlogs = { author: author, blogs: blogsPerAuthor[author] }
    }
  }

  return mostBlogs
}

const mostLikes = blogs => {
  if (blogs.length === 0) return null

  const likesPerAuthor = {}
  for (const blog of blogs) {
    if (blog.author in likesPerAuthor) {
      likesPerAuthor[blog.author] += blog.likes
    }
    else {
      likesPerAuthor[blog.author] = blog.likes
    }
  }

  let mostLikes = { author: 'none', likes: 0 }
  for (const author of Object.keys(likesPerAuthor)) {
    if (likesPerAuthor[author] > mostLikes.likes) {
      mostLikes = { author: author, likes: likesPerAuthor[author] }
    }
  }

  return mostLikes
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}