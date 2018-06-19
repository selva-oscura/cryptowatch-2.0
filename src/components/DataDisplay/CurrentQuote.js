import React from 'react';
import { currencyAbbreviations } from '../../fixtures/currencies.js';
import './CurrentQuote.css';

const CurrentQuote = ({ current, yesterday, symbols }) => {
  let yesterdayClose, priceChange;
  let priceDir = 'no-change';
  const fromCurrency =
    currencyAbbreviations.fromCurrencies[current.FROMSYMBOL] ||
    'flesh out currency list!';
  if (yesterday && current.PRICE) {
    yesterdayClose = yesterday[yesterday.length - 1].close;
    priceChange = (
      (100 * (current.PRICE - yesterdayClose)) /
      yesterdayClose
    ).toFixed(2);
    if (priceChange > 0) {
      priceDir = 'up';
    } else if (priceChange < 0) {
      priceDir = 'down';
    }
    priceChange = Math.abs(priceChange) + '%';
  } else {
    priceChange = '--';
  }

  return (
    <div className="CurrentQuote">
      <div className="flex-container">
        <div className="flex-item" style={{ textAlign: 'left' }}>
          <p className="quote-normal">{current.FROMSYMBOL}</p>
          <p className="quote-tiny">{fromCurrency}</p>
        </div>
        <div className="flex-item">
          <p className="quote-normal">
            {symbols[current.TOSYMBOL]}
            {current.PRICE.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="quote-tiny">Current Price</p>
        </div>
        <div className="flex-item" style={{ textAlign: 'right' }}>
          <p className={`quote-normal ${priceDir}`}>
            <span className={`${priceDir}-arrow`}>&lsaquo;</span>
            &nbsp;&nbsp;
            {priceChange}
          </p>
          <p className="quote-tiny">from yesterday&apos;s close</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentQuote;
