import React, { useState } from 'react'
import CSVReader from './Components/CSVReader'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import axios from 'axios'

const App = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [documentID, setDocumentID] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [stockDateRange, setStockDateRange] = useState(null)
  const [bullish, setBullish] = useState(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const handleUpload = async (data) => {
    console.log(data)
    // TODO: validate csv
    // if valid do:
    const quotesArray = data.map((item) => item.data)
    const firstDate = new Date(quotesArray[quotesArray.length - 1].date)
    const lastDate = new Date(quotesArray[0].date)

    setQuotes(quotesArray)
    setStockDateRange([firstDate, lastDate])
    setDateRange([firstDate, lastDate])
    setStartDate(firstDate.toISOString().split('T')[0])
    setEndDate(lastDate.toISOString().split('T')[0])
    setShowSubmit(true)
  }

  const handleDateChange = (dates) => {
    if (dates === null) return
    console.log('dates', dates)
    setDateRange(dates)

    setStartDate(dates[0].toISOString().split('T')[0])
    setEndDate(dates[1].toISOString().split('T')[0])
    console.log(dates[1].toISOString().split('T')[0])
  }

  const countBullish = async () => {
    const response = await axios.get(
      `/api/quotes/csv/${documentID}/bullish/?start=${startDate}&end=${endDate}`
    )
    const days = response.data.days
    const start = new Date(response.data.between[0])
    const end = new Date(response.data.between[1])
    setBullish(
      `Longest bullish trend: ${days} days between ${start.toDateString()} and ${end.toDateString()}`
    )
    return response.data
  }

  const submitCSV = async () => {
    const stockData = {
      code: 'EXAMPLE',
      quotes: [],
      dateRange: stockDateRange,
    }
    // post csv data
    const csvResponse = await axios.post('/api/csv', stockData)
    setDocumentID(csvResponse.data.id)

    // update quotes to include csv id
    const updatedQuotes = quotes.map((q) => ({
      ...q,
      importedCSV: csvResponse.data.id,
    }))

    // post quotes
    const quotesResponse = await axios.post('/api/quotes', {
      quotes: updatedQuotes,
      csvId: csvResponse.data.id,
    })
    setShowSubmit(false)
  }

  return (
    <div className="page-container">
      <CSVReader handleUpload={handleUpload} />
      {showSubmit && <button onClick={submitCSV}>Submit</button>}
      {documentID !== null && (
        <div className="date-container">
          <DateRangePicker
            onChange={handleDateChange}
            value={dateRange}
            minDate={stockDateRange[0]}
            maxDate={stockDateRange[1]}
            clearIcon={null}
          />
          <button className="btn date-container__analyze" onClick={countBullish}>Analyze</button>
        </div>
      )}
      {bullish !== null && <p>{bullish}</p>}
    </div>
  )
}

export default App
