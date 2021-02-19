const importedCSVRouter = require('express').Router()
const ImportedCSV = require('../models/importedCSV')

// Get all data
importedCSVRouter.get('/', async (request, response, next) => {
  const importedCSV = await ImportedCSV.find({})
  response.json(importedCSV)
})

// Quotes by csv id
importedCSVRouter.get('/:id/quotes', async (request, response, next) => {
  const importedCSV = await ImportedCSV.findById(request.params.id).populate('quotes')
  response.json(importedCSV)
})

// Post stockdata (formatted csv)
importedCSVRouter.post('/', async (request, response, next) => {
  const body = request.body
  const importedCSV = new ImportedCSV({
    code: body.code,
  })

  const savedData = await importedCSV.save()
  response.status(201).json(savedData.toJSON())
})

// Delete
importedCSVRouter.delete('/:id', async (request, response, next) => {
  await ImportedCSV.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = importedCSVRouter
