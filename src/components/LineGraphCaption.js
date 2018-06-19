import React from 'react';
import CCC from '../api/ccc-streamer-utilities.js';
import './LineGraphCaption.css';

const LineGraphCaption = ({ currencyPair, data }) => {
  let minPrice = Infinity,
    maxPrice = -Infinity,
    minPriceDate,
    maxPriceDate,
    [startDate, startPrice] = data[0],
    [endDate, endPrice] = data[data.length - 1],
    numDays,
    currencySymbol;

  // calculate minPrice & maxPrice price and their corresponding dates
  data.forEach(point => {
    if (point[1] < minPrice) {
      minPrice = point[1];
      minPriceDate = point[0];
    }
    if (point[1] > maxPrice) {
      maxPrice = point[1];
      maxPriceDate = point[0];
    }
  });

  // format dates and prices
  const countDays = (startDate, endDate) => {
    // note: timestamps from API are in seconds, not milliseconds
    return (endDate - startDate) / (24 * 60 * 60);
  };
  const formatDateFromTimestamp = timestamp => {
    // note: timestamps from API are in seconds, not milliseconds
    const date = new Date(timestamp * 1000);
    return `${(date.getMonth() % 12) + 1}/${date.getDate()}/${String(
      date.getFullYear()
    ).slice(-2)}`;
  };
  const formatPrice = price =>
    price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  numDays = countDays(startDate, endDate);
  minPrice = formatPrice(minPrice);
  maxPrice = formatPrice(maxPrice);
  minPriceDate = formatDateFromTimestamp(minPriceDate);
  maxPriceDate = formatDateFromTimestamp(maxPriceDate);
  startPrice = formatPrice(startPrice);
  endPrice = formatPrice(endPrice);
  startDate = formatDateFromTimestamp(startDate);
  endDate = formatDateFromTimestamp(endDate);

  // get currency symbol for real currency
  currencySymbol = CCC.STATIC.CURRENCY.SYMBOL[currencyPair.slice(-3)];

  return (
    <div className="LineGraphCaption">
      <div className="flex-container" style={{ alignItems: 'flex-end' }}>
        <div className="flex-item">
          <p className="quote-normal" style={{ textAlign: 'left' }}>
            {currencyPair}
          </p>
        </div>
        <div className="flex-item">
          <p
            className="quote-tiny"
            style={{ textAlign: 'right', verticalAlign: 'text-bottom' }}
          >
            (last {numDays} days)
          </p>
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-item">
          <p className="quote-tiny" style={{ textAlign: 'left' }}>
            {startDate}: {currencySymbol}
            {startPrice}
            <br />
            {endDate}: {currencySymbol}
            {endPrice}
          </p>
        </div>
        <div className="flex-item">
          <p className="quote-tiny" style={{ textAlign: 'right' }}>
            low: {currencySymbol}
            {minPrice} on {minPriceDate}
            <br />
            high: {currencySymbol}
            {maxPrice} on {maxPriceDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LineGraphCaption;
