import React, { Component } from 'react'
import { CSVReader } from 'react-papaparse'

export default class CSVReaderDragAndDrop extends Component {
  handleDrop = (data) => {
    const expectedHeaderFields = [
      'date',
      'closelast',
      'volume',
      'open',
      'high',
      'low',
    ]

    if (
      data[0].meta.fields.length === expectedHeaderFields.length &&
      data[0].meta.fields.every((value, i) => value === expectedHeaderFields[i])
    ) {
      this.props.handleUpload(data)
    } else {
      console.log('error')
      this.props.displayNotification(
        'error',
        'Error uploading the CSV | Make sure the file has a header row consisting of "Date, Close/Last, Volume, Open, High, Low"'
      )
    }
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {}

  render() {
    return (
      <>
        <h3>Upload your CSV file to begin</h3>
        <CSVReader
          onDrop={this.handleDrop}
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
