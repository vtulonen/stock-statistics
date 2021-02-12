import React, { Component } from 'react'
import { CSVReader } from 'react-papaparse'

export default class CSVReaderDragAndDrop extends Component {
  handleOnDrop = (data) => {
    console.log(data)
    console.log(data[0])
    console.log(data[0].data)
    console.log(data[0].data.Date)
    
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
            transformHeader: (value) => value.trim().replace('/', '').toLowerCase(),
            transform: (value) => value.trim().replace('$', ''),
          }}
        >
          <span>Drop CSV file here or click to upload.</span>
        </CSVReader>
      </>
    )
  }
}
