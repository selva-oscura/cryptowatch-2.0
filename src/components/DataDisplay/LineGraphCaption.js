import React from 'react';
import './LineGraphCaption.css';

const LineGraphCaption = ({ currencyPair, rangeData, symbols }) => {
  // get currency symbol for real currency
  let currencySymbol = symbols[currencyPair.slice(-3)];

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
            (last {rangeData.numDays} days)
          </p>
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-item">
          <p className="quote-tiny" style={{ textAlign: 'left' }}>
            {rangeData.startDate}: {currencySymbol}
            {rangeData.startPrice}
            <br />
            {rangeData.endDate}: {currencySymbol}
            {rangeData.endPrice}
          </p>
        </div>
        <div className="flex-item">
          <p className="quote-tiny" style={{ textAlign: 'right' }}>
            low: {currencySymbol}
            {rangeData.minPrice} on {rangeData.minPriceDate}
            <br />
            high: {currencySymbol}
            {rangeData.maxPrice} on {rangeData.maxPriceDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LineGraphCaption;
