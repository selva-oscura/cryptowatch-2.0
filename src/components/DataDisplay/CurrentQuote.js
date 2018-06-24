import React from 'react';
import './CurrentQuote.css';

const CurrentQuote = ({
  cryptoShortName,
  cryptoLongName,
  currentPrice,
  priceDir,
  priceChange,
  symbol,
}) => (
  <div className="CurrentQuote">
    <div className="flex-container">
      <div className="flex-item" style={{ textAlign: 'left' }}>
        <p className="quote-normal">{cryptoShortName}</p>
        <p className="quote-tiny">{cryptoLongName}</p>
      </div>
      <div className="flex-item">
        <p className="quote-normal">
          {symbol}
          {currentPrice}
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

export default CurrentQuote;
