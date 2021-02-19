const mongoose = require('mongoose')

const quoteSchema = mongoose.Schema({
  date: { type: Date },
  closelast: { type: Number },
  volume: { type: Number },
  open: { type: Number },
  high: { type: Number },
  low: { type: Number },
  importedCSV: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImportedCSV'
  }
})

quoteSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id
    delete obj._id
    delete obj.__v
  },
})

module.exports = mongoose.model('Quote', quoteSchema)
