const quotesRouter = require('express').Router()
const Quote = require('../models/quote')
const ImportedCSV = require('../models/importedCSV')
const helpers = require('../utils/helpers')

//All quotes
quotesRouter.get('/', async (request, response) => {
  const quotes = await Quote.find({})
  response.status(200).json(quotes.map((x) => x.toJSON()))
})

setQuotes = async (quoteIds, csvId) => {
  const response = await ImportedCSV.findByIdAndUpdate(csvId, {
    $addToSet: { quotes: quoteIds },
  })
}
// Post
quotesRouter.post('/', async (request, response) => {
  const { quotes, csvId } = request.body

  const savedQuotes = await Quote.insertMany(quotes, (err, docs) => {
    const quoteIds = docs.map((x) => x._id)
    setQuotes(quoteIds, csvId)
  })
  response.status(201).json(savedQuotes)
})

// Csv ids quotes withing date range, ascending order
quotesRouter.get('/csv/:id/', async (request, response) => {
  const { start, end } = request.query
  const startDate = new Date(start)
  const endDate = new Date(end)
  const quotes = await Quote.find({
    importedCSV: request.params.id,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 'asc' })
  response.status(200).json(quotes.map((x) => x.toJSON()))
})

quotesRouter.get('/csv/:id/bullish', async (request, response) => {
  const { start, end } = request.query
  const startDate = new Date(start)
  const endDate = new Date(end)
  const quotes = await Quote.find({
    importedCSV: request.params.id,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 'asc' })

  const bullish = helpers.countBullish(quotes)

  response.status(200).json(bullish)
})

quotesRouter.get('/csv/:id/volume-priceChange', async (request, response) => {
  const { start, end } = request.query
  const startDate = new Date(start)
  const endDate = new Date(end)
  const quotes = await Quote.find({
    importedCSV: request.params.id,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ highLowDiff: 'desc', volume: 'desc' })

  response.status(200).json(quotes)
})

module.exports = quotesRouter
