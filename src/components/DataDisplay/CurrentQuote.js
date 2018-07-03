import React from 'react';
import PropTypes from 'prop-types';
import './CurrentQuote.css';

const CurrentQuote = ({
  cryptoShortName,
  cryptoLongName,
  currentPrice,
  priceDir,
  priceChange = '--',
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
          {currentPrice && (
            <span>
              {symbol}
              {currentPrice}
            </span>
          )}
          {!currentPrice && <span className="quote-tiny">Awaiting Update</span>}
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

CurrentQuote.propTypes = {
  cryptoShortName: PropTypes.string.isRequired,
  cryptoLongName: PropTypes.string.isRequired,
  currentPrice: PropTypes.string,
  priceDir: PropTypes.string.isRequired,
  priceChange: PropTypes.string,
  symbol: PropTypes.string.isRequired,
};

export default CurrentQuote;
