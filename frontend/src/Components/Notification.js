import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ type, message }) => {
  const successStyle = {
    color: 'green',
    background: 'rgb(216, 216, 216)',
    fontSize: '1.5rem',
    border: '2px solid green',
    borderRadius: '5px',
    padding: '.5em .5em',
    margin: '1rem 0',
  }

  const errorStyle = {
    color: '#b94858',
    fontSize: '1.5rem',
    border: '2px solid #b94858',
    borderRadius: '5px',
    padding: '.5em .5em',
    margin: '1rem 0',
  }

  if (message === null) {
    return null
  }
  return (
    <div style={type === 'success' ? successStyle : errorStyle}>{message}</div>
  )
}

Notification.propTypes = {
  type: PropTypes.oneOf(['success', 'error']),
}

export default Notification
