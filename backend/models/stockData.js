const mongoose = require('mongoose')

const stockDataSchema = mongoose.Schema({
  code: { type: String },
  // Name?: Filename / Company name?
  // DateRange?: [first, last]?
  // id
  quotes: [ //TODO quote to its own schema ?
    {
      date: { type: Date },
      closelast: { type: Number },
      volume: { type: Number },
      open: { type: Number },
      high: { type: Number },
      low: { type: Number },
    },
  ],
})

stockDataSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

stockDataSchema.set('toJSON', {
  virtuals: true,
  
})

module.exports = mongoose.model('StockData', stockDataSchema)
