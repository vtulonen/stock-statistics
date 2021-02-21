import React, { useState } from 'react'
import CSVReader from './Components/CSVReader'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import axios from 'axios'

const App = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [documentID, setDocumentID] = useState("")
  const [quotes, setQuotes] = useState([])

  const handleUpload = async (data) => {
    // TODO: validate csv
    // if valid do:
    const quotesArray = data.map((item) => item.data)
    setQuotes(quotesArray)
  }

  const handleDateChange = (dates) => {
    console.log('dates', dates)
    setDateRange(dates)
    setStartDate(dates[0].toISOString().split('T')[0])
    setEndDate(dates[1].toISOString().split('T')[0])
  }

  const submitCSV = async (e) => {
    console.log(e)
    const stockData = {
      code: "test",
      quotes: []
    }
    // post csv data
    const csvResponse = await axios.post('/api/csv', stockData)
    setDocumentID(csvResponse.data.id)

    // update quotes to include csv id
    const updatedQuotes = quotes.map(q => ({...q, importedCSV: csvResponse.data.id}))
    
    // post quotes
    const quotesResponse = await axios.post('/api/quotes', {quotes: updatedQuotes, csvId: csvResponse.data.id})
    console.log(quotesResponse)
  } 

  return (
    <div>
      <CSVReader handleUpload={handleUpload} />
      <DateRangePicker onChange={handleDateChange} value={dateRange} />
      <button
        onClick={() => {
          console.log(documentID)
          console.log(quotes)
          console.log('range', dateRange)
          console.log('start', startDate)
          console.log('end', endDate)
        }}
      >
        log
      </button>
  
      <button
        onClick={async () => {
          const response = await axios.get(
            `/api/quotes/csv/${documentID}/bullish/?start=${startDate}&end=${endDate}`
          )
          const days = response.data.days
          const start = new Date(response.data.between[0])
          const end = new Date(response.data.between[1])
          console.log(response.data)
          console.log(`Longest bullish trend: ${days} days between ${start.toDateString()} and ${end.toDateString()}`)
          return response.data
        }}
      >
        bullish
      </button>
      <button
        onClick={submitCSV}>
        submit
      </button>
    </div>
  )
}

export default App
