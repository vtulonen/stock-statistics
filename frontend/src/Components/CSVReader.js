import React, { Component } from 'react'
import { CSVReader } from 'react-papaparse'
import axios from 'axios'

export default class CSVReaderDragAndDrop extends Component {
  handleOnDrop = async (data) => {
    // TODO: validate csv
    // if valid do:
    const quoteArray = data.map((item) => item.data)
    const stockData = {
      code: 'testcode', // change to user input later
      quotes: quoteArray,
    }
    
    console.log(stockData)
    const response = await axios.post('/api/stockData', stockData)
    return response.data
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    console.log(data)
  }

  render() {
    return (
      <>
        <h5>Click and Drag Upload</h5>
        <CSVReader
          onDrop={this.handleOnDrop}
          onError={this.handleOnError}
          addRemoveButton
          onRemoveFile={this.handleOnRemoveFile}
          config={{
            header: true,
            //Transform keys and values to strings w/o whitespace
            transformHeader: (value) =>
              value.trim().replace('/', '').toLowerCase(),
            transform: (value) => value.trim().replace('$', ''),
          }}
        >
          <span>Drop CSV file here or click to upload.</span>
        </CSVReader>
      </>
    )
  }
}
