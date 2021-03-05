import React, { Component } from 'react'
import { CSVReader } from 'react-papaparse'

export default class CSVReaderDragAndDrop extends Component {
 
  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    console.log(data)
  }

  render() {
    return (
      <>
        <h3>Upload your CSV file to begin</h3>
        <CSVReader
          onDrop={this.props.handleUpload}
          onError={this.handleOnError}
          addRemoveButton
          onRemoveFile={this.props.handleRemove}
          config={{
            skipEmptyLines: true,
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
