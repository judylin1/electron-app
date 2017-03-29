const R = require('ramda');

// Run this function after the page has loaded
$(() => {

const stocks = [
  "CL=F", // Crude oil, http://finance.yahoo.com/quote/CL=F?p=CL=F
  "GC=F", // Gold, https://finance.yahoo.com/quote/GC=F?p=GC=F
  "SI=F",  // Silver, https://finance.yahoo.com/quote/SI=F?p=SI=F
  "PL=F" // Platinum, http://finance.yahoo.com/quote/PL=F?p=PL=F
]

const fields = 'f=pl1' // Requests the current price and previous closing price
const symbols = `s=${stocks.join('+')}`
const url = `https://finance.yahoo.com/d/quotes.csv?${fields}&${symbols}`

$.ajax(url).done(csv => {
  // Split the output up into an array of lines
  const lines = csv.trim().split('\n');

  return lines.map((line, index) => {
    //Split the line up by comma
    const prices = lines[index].split(',');

    // Previous closing price of stock symbol
    const previousPrice = parseFloat(prices[0], 10);

    // Current price of stock symbol
    const currentPrice = parseFloat(prices[1], 10);

    // Change between closing price and current price rounded to 2 decimal points.
    const change = Math.round((currentPrice - previousPrice) * 100) / 100;

    // Add a leading + for positive change
    const checkPosChange = (Math.round((currentPrice - previousPrice) * 100) / 100) >= 0 ? `+${change}` : change;

    // Add prices and changes to HTML element
    R.call(R.cond([
      [R.equals(0), () => {
        $('#oil-price').text(currentPrice.toLocaleString());
        $('#oil-change').text(checkPosChange);
      }],
      [R.equals(1), () => {
        $('#gold-price').text(currentPrice.toLocaleString());
        $('#gold-change').text(checkPosChange);
      }],
      [R.equals(2), () => {
        $('#silver-price').text(currentPrice.toLocaleString());
        $('#silver-change').text(checkPosChange);
      }],
      [R.equals(3), () => {
        $('#platinum-price').text(currentPrice.toLocaleString());
        $('#platinum-change').text(checkPosChange);
      }],
    ]), index);
  })
}).fail(error => console.error(error))

})
