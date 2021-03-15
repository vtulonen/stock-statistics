import React, { useState } from 'react'
import CSVReader from './Components/CSVReader'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import Table from './Components/Table'
import axios from 'axios'
import Header from './Components/Header'
axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT

const App = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [dateRangeString, setDateRangeString] = useState(null)
  const [minMaxDates, setMinMaxDates] = useState(null)
  const [documentID, setDocumentID] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [bullish, setBullish] = useState(null)
  const [volumePriceChange, setVolumePriceChange] = useState(null)
  const [bestOpening, setBestOpening] = useState(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const handleUpload = async (data) => {
    data.forEach((item) => {
      // format date to yyyy-mm-dd
      item.data.date = dateToString(new Date(item.data.date))
    })

    // TODO: validate csv
    // if valid do:
    const quotesArray = data.map((item) => item.data)
    const firstDate = new Date(quotesArray[quotesArray.length - 1].date)
    let lastDate = new Date(quotesArray[0].date)
    lastDate.setHours(23, 59, 59)

    setQuotes(quotesArray)
    setDateRange([firstDate, lastDate])
    setMinMaxDates([firstDate, lastDate])
    setDateRangeString([dateToString(firstDate), dateToString(lastDate)])
    setShowSubmit(true)
  }

  const handleDateChange = (dates) => {
    if (dates === null) return
    setDateRange(dates)
    setDateRangeString([dateToString(dates[0]), dateToString(dates[1])])
  }

  const dateToString = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0]
  }

  const handleRemove = () => {
    //Resets states
    setQuotes(null)
    setDateRange([new Date(), new Date()])
    setDateRangeString(null)
    setMinMaxDates(null)
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
      dateRange: dateRangeString,
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
    console.log(dateRangeString)
    const response = await axios.get(
      `/api/quotes/csv/${documentID}/bullish/?start=${dateRangeString[0]}&end=${dateRangeString[1]}`
    )

    setBullish(response.data)
    return response.data
  }

  const getVolumePriceChange = async () => {
    const response = await axios.get(
      `/api/quotes/csv/${documentID}/volume-priceChange/?start=${dateRangeString[0]}&end=${dateRangeString[1]}`
    )
    console.log(response.data)
    setVolumePriceChange(response.data)
    return response.data
  }

  const getBestOpening = async () => {
    const response = await axios.get(
      `/api/quotes/csv/${documentID}/bestOpening/?start=${dateRangeString[0]}&end=${dateRangeString[1]}`
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
      <Header
        title='Stock Analyzer'
        text='Analyze a CSV file containing stock quote data to get detailed information about the stock'
      />
      <main>
        <div className='csv-reader-container'>
          <CSVReader handleUpload={handleUpload} handleRemove={handleRemove} />
          {showSubmit && (
            <button className='btn-submit' onClick={submitCSV}>
              Submit
            </button>
          )}
        </div>

        {documentID !== null && (
          <div className='date-container'>
            <DateRangePicker
              format={'MM/dd/yyyy'}
              onChange={handleDateChange}
              value={dateRange}
              minDate={minMaxDates[0]}
              maxDate={minMaxDates[1]}
              clearIcon={null}
            />

            <button className='btn-analyze' onClick={analyze}>
              Analyze
            </button>
          </div>
        )}
        {bullish !== null && (
          <div className='bullish'>
            <p>
              Longest Bullish Trend: <em>{bullish.days}</em> days between{' '}
              <em>{bullish.between[0]}</em> and <em>{bullish.between[1]}</em>
            </p>
          </div>
        )}
        <div className='tables-container'>
          {volumePriceChange !== null && (
            <Table
              title={'Highest trading volume and price change'}
              data={volumePriceChange}
              columns={[
                {
                  Header: 'Volume',
                  accessor: 'volume',
                },
                {
                  Header: 'Price Change $',
                  accessor: 'highLowDiff',
                },
                {
                  Header: 'Date',
                  accessor: 'date',
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
                  Header: 'Price Change %',
                  accessor: 'percentageChange',
                },
                {
                  Header: 'Date',
                  accessor: 'date',
                },
              ]}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
