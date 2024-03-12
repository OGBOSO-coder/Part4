const { test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog");
const api = supertest(app)


const initialBlogs = [
  {
    title: "Excel Project",
    author: "Excel",
    url: "excel.url",
    likes: 29,
  },
  {
    title: "DevWithMe",
    author: "DevMe",
    url: "devme.url",
    likes: 39,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let noteObject = new Blog(initialBlogs[0]);
  await noteObject.save();
  noteObject = new Blog(initialBlogs[1]);
  await noteObject.save();
});

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 3 notes', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  const title = response.body.map(e => e.title)
  // is the parameter truthy
  assert(title.includes("Excel Project"))
})

test("blog post has 'id' property instead of '_id'", async () => {
  const response = await api.get("/api/blogs");

  const blog = response.body[0];
  assert.strictEqual(typeof blog.id, 'string');
});


after(async () => {
  await mongoose.connection.close()
})
