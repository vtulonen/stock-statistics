const mongoose = require('mongoose')
const { quoteSchema } = require('../models/quote')

const stockDataSchema = mongoose.Schema({
  code: { type: String },
  quotes: [quoteSchema],
  // Name?: Filename / Company name?
  // DateRange?: [first, last]?
})

stockDataSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id
    delete obj._id
    delete obj.__v
  },
})

module.exports = mongoose.model('StockData', stockDataSchema)
