const stockDataRouter = require('express').Router()
const StockData = require('../models/stockData')

stockDataRouter.get('/', async (request, response, next) => {
    const stockData = await StockData.find({})
    response.json(stockData)
  })
  

stockDataRouter.post('/', async (request, response, next) => {
  const body = request.body
  const stockData = new StockData({
    code: body.code,
    quotes: body.quotes,
  })

  const savedData = await stockData.save()
  response.status(201).json(savedData.toJSON())
})

module.exports = stockDataRouter
