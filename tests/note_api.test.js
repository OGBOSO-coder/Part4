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

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "LMS-MERN Project",
    author: "Excel",
    url: "excel.url",
    likes: 7900,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const contents = response.body.map((r) => r.title);
  assert.strictEqual(response.body.length, initialBlogs.length + 1);
  assert.ok(contents.includes("LMS-MERN Project"));
});

test("missing likes property defaults to 0", async () => {
  const newBlog = {
    title: "Check if likes missing",
    author: "Missing Likes",
    url: "http://test.url",
    // likes property is intentionally omitted
  };

  await api.post("/api/blogs").send(newBlog);

  const response = await api.get("/api/blogs");
  const addedBlog = response.body.find(
    (blog) => blog.title === "Check if likes missing"
  );

  assert.strictEqual(addedBlog.likes, 0);
});

test("returns 400 Bad Request if title is missing", async () => {
  const newBlog = {
    author: "John Doe",
    url: "https://example.com",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("returns 400 Bad Request if url is missing", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Jane Doe",
    likes: 20,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

after(async () => {
  await mongoose.connection.close()
})
