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

quotesRouter.get('/csv/:id/bestOpening', async (request, response) => {
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

  const previousFour = await Quote.find({ _id: { $gt: quotes[0].id } })
    .sort({ _id: 'asc' })
    .limit(4)

  const quoteOriginalLength = quotes.length
  const openingPrices = quotes.map((quote) => quote.open)

  //Concat previous four to calculate sma
  const allQuotes = previousFour.concat(quotes)
  const closePrices = allQuotes.map((quote) => quote.closelast)

  let SMAs = helpers.countSMA(closePrices)
  while (SMAs.length != quoteOriginalLength) SMAs.shift() //remove previous ones

  const bestOpening = quotes.map((quote, i) => ({
    date: quote.date,
    percentageChange: helpers.percentageChange(openingPrices[i], SMAs[i]),
  }))

  bestOpening.sort((a, b) => b.percentageChange - a.percentageChange) // sort highest first

  response.status(200).json(bestOpening)
})

module.exports = quotesRouter
