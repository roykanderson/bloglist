describe('Blog app', function() {
  beforeEach(function() {
    cy.resetDb()
    cy.createUser({ name: 'Roy', username: 'testuser', password: 'secret' })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log In')
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Logged in as Roy')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'Roy logged in')
      cy.contains('Invalid username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'secret' })
    })

    it('A blog can be created', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('John Doe')
      cy.get('#url').type('test.com')
      cy.get('#create-blog-button').click()

      // Reload page to make sure blog persists
      cy.visit('http://localhost:3000')

      cy.contains('Test Title')
      cy.contains('John Doe')
      cy.contains('View')
    })

    it('A blog can be liked', function() {
      cy.createBlog({ title: 'foo', author: 'bar', url: 'baz' })
      cy.contains('foo').parent().find('.blog-view-button').as('viewButton')
      cy.get('@viewButton').click()
      cy.get('.like-button').click()

      cy.contains('Likes 1')
      cy.contains('Liked')
    })

    it('A blog can be deleted', function() {
      cy.createBlog({ title: 'foo', author: 'bar', url: 'baz' })
      cy.contains('foo').parent().find('.blog-view-button').as('viewButton')
      cy.get('@viewButton').click()
      cy.get('#remove-button').click()

      cy.get('html').should('not.contain', 'foo bar')
    })

    it('Blogs are ordered by likes (most likes first)', function() {
      cy.createBlog({ title: 'last', author: 'bar', url: 'baz', likes: 1})
      cy.createBlog({ title: 'middle', author: 'exam', url: 'pass', likes: 2})
      cy.createBlog({ title: 'most', author: 'likes', url: 'blog', likes: 3})

      cy.get('.blog-title-author').eq(0).should('contain', 'most')
      cy.get('.blog-title-author').eq(1).should('contain', 'middle')
      cy.get('.blog-title-author').eq(2).should('contain', 'last')
    })
  })
})