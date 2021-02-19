const quotesRouter = require('express').Router()
const Quote = require('../models/quote')
const ImportedCSV = require('../models/importedCSV')

//All quotes
quotesRouter.get('/', async (request, response) => {
  const quotes = await Quote.find({})
  response.json(quotes.map((x) => x.toJSON()))
})

setQuotes = async (quoteIds, csvId) => {
  const csv = await ImportedCSV.findByIdAndUpdate(csvId, {
    $addToSet: { quotes: quoteIds },
  })
}
// Post
quotesRouter.post('/', async (request, response) => {
  const { quotes, csvId } = request.body
  const savedQuotes = await Quote.insertMany(quotes, (err, docs) => {
    const quoteIds = docs.map((x) => x.id)
    setQuotes(quoteIds, csvId)
  })
  response.json(savedQuotes)
})

// Csv id quotes withing date range
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
    
  })
  response.json(quotes.map((x) => x.toJSON()))
})

module.exports = quotesRouter
