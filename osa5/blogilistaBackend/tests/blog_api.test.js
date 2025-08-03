const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const jwt = require('jsonwebtoken')


const api = supertest(app)

const initialBlogs = [
    {
     title: "Testiblogi",
     author: "IntelliJ Tester",
     url: "http://esimerkki.fi",
     likes: 42
    },
    {
     title: "uusiBlogi",
     author: "vsCode Tester",
     url: "http://google.fi",
     likes: 22
    }
]

let token = null
let testUser = null

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash,
        blogs: []
    })
    testUser = await user.save()

    const userForToken = {
        username: testUser.username,
        id: testUser._id
    }
    token = jwt.sign(userForToken, process.env.SECRET)

    for (let blogData of initialBlogs) {
        const blog = new Blog({
            ...blogData,
            user: testUser._id
        })
        const savedBlog = await blog.save()
        testUser.blogs = testUser.blogs.concat(savedBlog._id)
    }

    await testUser.save()
})

test('Right amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('id is not _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert.notStrictEqual(blog.id, undefined, 'id should be defined') // Not equal
        assert.strictEqual(blog._id, undefined, '_id should not be defined') // Should be equal
    })
})

test('a blog  can be added', async() => {
    const newBlog = {
        title: 'randomBlogi',
        author: 'minä',
        url: 'www.testi.com',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    console.assert(titles.includes('randomBlogi'))

})


test('the likes is 0 if not given', async() => {
    const newBlog = {
        title: 'randomBlogi',
        author: 'minä',
        url: 'www.testi.com'
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const addedBlog = response.body.find(blog => blog.title === 'randomBlogi')
    assert.strictEqual(addedBlog.likes, 0)


})

test('blog without title or url is not added', async () => {
    const newBlog = {
        author: 'minä',
        likes: 4
    }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('Deletion of blog succeeds with 204 if id is valid', async () => {

    const response = await api.get('/api/blogs')
    const blogToDelete = response.body[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await Blog.find({})

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
})

test('adding a blog returns 401 if token not provided', async () => {
    const newBlog = {
        title: 'This will fail',
        author: 'Unauthorized',
        url: 'http://google.fi'
    }

    const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
})



test('Blog can be updated', async () => {

    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body.find(blog => blog.title === 'uusiBlogi')

    const updatedBlog = {
        title: 'uusiBlogi',
        author: 'vsCode Tester',
        url: 'http://google.fi',
        likes: 4
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await api.get('/api/blogs')
    const updatedBlogInDb = blogsAtEnd.body.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(updatedBlogInDb.likes, 4)
})


test('creation fails with proper statuscode and message if username already taken', async () => {
    const rootUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret'
    }

    await api
      .post('/api/users')
      .send(rootUser)

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'hessu',
      password: 'test',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})


test('creation fails when the password length is under 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'moi',
      name: 'vaan',
      password: 'te',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('The password min length is 3'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

})


after(async () => {
  await mongoose.connection.close()
})