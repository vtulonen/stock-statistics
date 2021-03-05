const importedCSVRouter = require('express').Router()
const ImportedCSV = require('../models/importedCSV')
const Quote = require('../models/quote')

// Get all data
importedCSVRouter.get('/', async (request, response, next) => {
  const importedCSV = await ImportedCSV.find({})
  response.status(200).json(importedCSV)
})

// Quotes by csv id
importedCSVRouter.get('/:id/quotes', async (request, response, next) => {
  const importedCSV = await ImportedCSV.findById(request.params.id).populate('quotes')
  response.status(200).json(importedCSV)
})

// Post stockdata (formatted csv)
importedCSVRouter.post('/', async (request, response, next) => {
  const body = request.body
  const importedCSV = new ImportedCSV({
    code: body.code,
    dateRange: body.dateRange
  })

  const savedData = await importedCSV.save()
  response.status(201).json(savedData.toJSON())
})

// Delete all csvs and quotes
importedCSVRouter.delete('/', async (request, response, next) => {
  await ImportedCSV.deleteMany();
  await Quote.deleteMany();
  response.status(204).end()
})

// Delete csv + quotes by csv id
importedCSVRouter.delete('/:id', async (request, response, next) => {
  const csvToDelete = await ImportedCSV.findById(request.params.id)
  if (csvToDelete == null) return response.status(400).json({error: 'invalid id'})
  await ImportedCSV.findOneAndRemove(request.params.id)
  await Quote.deleteMany({importedCSV: request.params.id})
  response.status(204).end()
})

module.exports = importedCSVRouter