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

let db = [
  {
    code: "AAPL",

    quotes: [
      {
        date: '01/20/2021',
        closelast: '132.03',
        volume: '104319500',
        open: '128.66',
        high: '132.49',
        low: '128.55',
      },
      {
        date: '01/19/2021',
        closelast: '127.83',
        volume: '90757330',
        open: '127.78',
        high: '128.71',
        low: '126.938',
      },
      {
        date: '01/15/2021',
        closelast: '127.14',
        volume: '111598500',
        open: '128.78',
        high: '130.2242',
        low: '127',
      },
      {
        date: '01/14/2021',
        closelast: '128.91',
        volume: '90221760',
        open: '130.8',
        high: '131',
        low: '128.76',
      },
    ],
  },
]

//app.use(middleware.unknownEndpoint)

app.get('/', (req, res) => {
  res.send('<h1>Stock Statistics</h1>')
})

app.get('/api/db', (req, res) => {
  res.json(db)
})
