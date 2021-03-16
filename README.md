# Stock-Statistics

App reads a csv file containing stock quotes and analyzes it withing given date range

## LIVE PREVIEW

## https://stock-statistics-frontend.herokuapp.com/

# Tech

## Frontend

React webapp that uploads user submitted CSV file to database and displays analyzed data based on desired date range
For MVP puproses, currently only one csv can be uploaded, and it will be removed whem submitting a new one, but it can be implemented to allow users to store multiple csv files.

## Backend

Node.js > Express API that interacts with MongoDB using Mongoose

## API Endpoints

### Backend > https://stock-statistics-api.herokuapp.com/

1. GET /api/quotes
  - Return all quotes in db

2. GET /api/quotes/csv/:id?startDate={param}&endDate={param}
  - Return quotes of specific CSV withing given date range
  
3. GET /api/quotes/csv/:id/bullish?startDate={param}&endDate={param}
  - Return calculated bullish trend, object containig { date: number, between: [date, date] } withing given date range
  
4. GET /api/quotes/csv/:id/volume-priceChange?startDate={param}&endDate={param}
  - Return a list of volumes, high-low price changes of the day and date

5. GET /api/quotes/csv/:id/bestOpening?startDate={param}&endDate={param}
  - Retrun a list of dates and price change percentages compared to calculated 5 day simple moving average withing given date range

6. POST /api/quotes { quotes[], csvId } & /api/csv { code: 'test', dateRange: [date, date] }
  - Used to post CSV information to db, after which quotes are posted including the csv ID withing given date range
 
7. DELETE /api/csv & /api/csv/:id
  - Former deletes all csv and quotes, latter deletes both by csv id

