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

test.only('Right amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test.only('id is not _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert.notStrictEqual(blog.id, undefined, 'id should be defined') // Not equal
        assert.strictEqual(blog._id, undefined, '_id should not be defined') // Should be equal
    })
})
