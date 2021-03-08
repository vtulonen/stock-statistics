import React, { useState } from 'react'
import CSVReader from './Components/CSVReader'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import Table from './Components/Table'
import axios from 'axios'

const App = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [documentID, setDocumentID] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [stockDateRange, setStockDateRange] = useState(null)
  const [bullish, setBullish] = useState(null)
  const [volumePriceChange, setVolumePriceChange] = useState(null)
  const [bestOpening, setBestOpening] = useState(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const handleUpload = async (data) => {
    console.log(data)
    // TODO: validate csv
    // if valid do:
    const quotesArray = data.map((item) => item.data)
    const firstDate = new Date(quotesArray[quotesArray.length - 1].date)
    let lastDate = new Date(quotesArray[0].date)
    lastDate.setHours(23, 59, 59)

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
  }

  const handleRemove = () => {
    //Resets states
    setQuotes(null)
    setStockDateRange([null])
    setDateRange([new Date(), new Date()])
    setStartDate(null)
    setEndDate(null)
    setShowSubmit(false)
    setBullish(null)
    setBestOpening(null)
    setVolumePriceChange(null)
    setDocumentID(null)
  }

  const submitCSV = async () => {
    const stockData = {
      code: 'USERUPLOAD',
      quotes: [],
      dateRange: stockDateRange,
    }
    // remove exisiting data
    await axios.delete('api/csv')

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

  const getBullish = async () => {
    const response = await axios.get(
      `/api/quotes/csv/${documentID}/bullish/?start=${startDate}&end=${endDate}`
    )
    const days = response.data.days
    const start = new Date(response.data.between[0])
    const end = new Date(response.data.between[1])
    console.log(response.data)
    setBullish(
      `Longest bullish trend: ${days} days between ${start.toDateString()} and ${end.toDateString()}`
    )
    return response.data
  }

  const getVolumePriceChange = async () => {
    const response = await axios.get(
      `/api/quotes/csv/${documentID}/volume-priceChange/?start=${startDate}&end=${endDate}`
    )
    console.log(response.data)
    setVolumePriceChange(response.data)
    return response.data
  }

  const getBestOpening = async () => {
    const response = await axios.get(
      `/api/quotes/csv/${documentID}/bestOpening/?start=${startDate}&end=${endDate}`
    )
    console.log(response.data)
    setBestOpening(response.data)
    return response.data
  }

  const analyze = async () => {
    getBullish()
    getVolumePriceChange()
    getBestOpening()
  }

  return (
    <div className='page-container'>
      <CSVReader handleUpload={handleUpload} handleRemove={handleRemove} />
      {showSubmit && <button onClick={submitCSV}>Submit</button>}
      {documentID !== null && (
        <div className='date-container'>
          <DateRangePicker
            format={'MM/dd/y'}
            onChange={handleDateChange}
            value={dateRange}
            minDate={stockDateRange[0]}
            maxDate={stockDateRange[1]}
            clearIcon={null}
          />

          <button className='btn date-container__analyze' onClick={analyze}>
            Analyze
          </button>
          <button
            onClick={() => {
              console.log('daterange', dateRange, 'stockdr', stockDateRange)
            }}
          ></button>
        </div>
      )}
      {bullish !== null && <div className="bullish">{bullish}</div>}
      <div className='tables-container'>
        {volumePriceChange !== null && (
          <Table
            title={'Highest trading volume and price change'}
            data={volumePriceChange}
            columns={[
              {
                Header: 'Date',
                accessor: 'date',
              },
              {
                Header: 'Volume',
                accessor: 'volume',
              },
              {
                Header: 'Price Change $',
                accessor: 'highLowDiff',
              },
            ]}
          />
        )}
        {bestOpening !== null && (
          <Table
            title={'Best opening price compared to SMA5'}
            data={bestOpening}
            columns={[
              {
                Header: 'Date',
                accessor: 'date',
              },
              {
                Header: 'Price Change %',
                accessor: 'percentageChange',
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}

export default App
