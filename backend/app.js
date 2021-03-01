const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const importedCSVRouter = require('./controllers/importedCSV')
const quotesRouter = require('./controllers/quote')

logger.info('connecting to', config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use('/api/csv', importedCSVRouter)
app.use('/api/quotes', quotesRouter)

app.use(morgan('tiny'))

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app