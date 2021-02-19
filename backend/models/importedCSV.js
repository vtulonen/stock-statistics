const mongoose = require('mongoose')

const importedCSVSchema = mongoose.Schema({
  code: { type: String },
  quotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
    },
  ],
  // Name?: Filename / Company name?
  // DateRange?: [first, last]?
})

importedCSVSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id
    delete obj._id
    delete obj.__v
  },
})


module.exports = mongoose.model('ImportedCSV', importedCSVSchema)


