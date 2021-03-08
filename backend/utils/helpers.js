const countBullish = (quotes) => {
  /*
    Function: Counts an upward trend of close/last prices of a stock between a date range
    Args: quotes = array of quote objects
    Retruns: an object containing:
        days: (number) of bullish days in row
        dateRange: (array of 2 dates) start and end date when the bullish days occured
    Notes: if two equally long bullish periods are found, returns the most recent one
*/
  const closePrices = quotes.map((quote) => quote.closelast)

  let bullish = 0
  let tempBullish = 1
  let endDateIndex = 0
  let prevPrice = 0

  closePrices.forEach((price, i) => {
    if (i == 0) {
      prevPrice = price
      return
    }
    if (price > prevPrice) {
      tempBullish += 1
    } else {
      tempBullish = 1
    }
    if (bullish <= tempBullish) {
      bullish = tempBullish
      endDateIndex = i
    }
    prevPrice = price
  })

  const startDate = quotes[endDateIndex - bullish + 1].date
  const endDate = quotes[endDateIndex].date

  const result = {
    days: bullish,
    between: [formatUTCDate(startDate), formatUTCDate(endDate)],
  }
  return result
}

const countSum = (numArray) => {
  return numArray.reduce((acc, val) => acc + val, 0)
}

const roundTwoDec = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

const countSMA = (numbers, period = 5) => {
  let data = []
  let smaArray = []
  numbers.forEach((num, i) => {
    data.push(num)
    if (i >= period) data.shift()
    smaArray.push(countSum(data) / period)
  })

  return smaArray
}

const percentageChange = (a, b) => {
  return roundTwoDec(((a - b) / b) * 100)
}

const formatUTCDate = (date) => {
  let formatted = new Date(date.toString()).toISOString().split('T')[0].split('-').reverse() // utc to local w/o timezone, array
  let temp = formatted[0]
  formatted[0] = formatted[1] // swap month and date
  formatted[1] = temp

  return formatted.join('/') // final format mm/dd/yyyy
}



module.exports = {
  countBullish,
  countSMA,
  percentageChange,
  roundTwoDec,
  formatUTCDate
}
