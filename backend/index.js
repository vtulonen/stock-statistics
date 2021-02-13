const http = require('http')
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
require('express-async-errors')
const stockDataRouter = require('./controllers/stockData')

app.use(cors())
app.use(express.json())
app.use('/api/stockData', stockDataRouter)

app.listen(process.env.PORT)
console.log(`Server running on port ${process.env.PORT}`)

const morgan = require('morgan')
app.use(morgan('tiny'))

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

app.use(middleware.unknownEndpoint)

