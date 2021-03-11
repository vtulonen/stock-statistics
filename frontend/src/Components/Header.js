import React from 'react'

const Header = ({ title, text }) => {
  const headerStyle = {
    background: '#fffff0',
    display: 'flex',
    flexDirection: 'column',
    padding: '3rem 10%',
  }

  const titleStyle = {
    fontSize: '3rem',
  }

  const textStyle = { fontSize: '2rem' }

  return (
    <div className='header' style={headerStyle}>
      <h2 className='header__title' style={titleStyle}>
        {title}
      </h2>
      <p className='header__text' style={textStyle}>
        {text}
      </p>
    </div>
  )
}

export default Header
