const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 3 notes', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 3)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  const title = response.body.map(e => e.title)
  // is the parameter truthy
  assert(title.includes("Boso tuto"))
})

after(async () => {
  await mongoose.connection.close()
})
