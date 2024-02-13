const config = require ("./utils/config")
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require ("./utils/middleware")
const blogsRouter = require("./controllers/blogs")

mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/blogs", blogsRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
