const listHelper = require('../utils/list_helper.js')

const emptyList = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithManyBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Bob',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676134d17f8',
    title: 'Go To Statement Considered Beneficial',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 6,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d10f8',
    title: 'Go To Statement Considered Neutral',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 2,
    __v: 0
  }
]

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated correctly', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(13)
  })
})

describe('favoriteBlog', () => {
  test('of empty list is null', () => {
    expect(listHelper.favoriteBlog(emptyList)).toBe(null)
  })

  test('when the list has only one blog, is that blog', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    )
  })

  test('of a bigger list is chosen correctly', () => {
    expect(listHelper.favoriteBlog(listWithManyBlogs)).toEqual(
      {
        _id: '5a422aa71b54a676134d17f8',
        title: 'Go To Statement Considered Beneficial',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 6,
        __v: 0
      }
    )
  })
})

describe('mostBlogs', () => {
  test('of an empty list is null', () => {
    expect(listHelper.mostBlogs(emptyList)).toBe(null)
  })

  test('when the list has only one blog, is correct', () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      }
    )
  })

  test('of a bigger list is correct', () => {
    expect(listHelper.mostBlogs(listWithManyBlogs)).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        blogs: 2
      }
    )
  })
})

describe('mostLikes', () => {
  test('of an empty list is null', () => {
    expect(listHelper.mostLikes(emptyList)).toBe(null)
  })

  test('when the list has only one blog, is correct', () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })

  test('of a bigger list is correct', () => {
    expect(listHelper.mostLikes(listWithManyBlogs)).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 8
      }
    )
  })
})