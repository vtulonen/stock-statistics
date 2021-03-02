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

quoteSchema.virtual('highLowDiff').get(function() {
  const diff = Math.abs(this.high - this.low)
  return Math.round((diff + Number.EPSILON) * 100) / 100
})

quoteSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, obj) => {
    obj.id = obj._id
    delete obj._id
    delete obj.__v
  },
})

module.exports = mongoose.model('Quote', quoteSchema)
