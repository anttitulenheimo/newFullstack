const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

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

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
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
        .expect(204)

    const blogsAtEnd = await Blog.find({})

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
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


after(async () => {
  await mongoose.connection.close()
})