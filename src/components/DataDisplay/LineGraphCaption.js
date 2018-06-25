import React from 'react';
import PropTypes from 'prop-types';
import './LineGraphCaption.css';

const LineGraphCaption = ({ currencyPair, rangeData, symbol }) => {
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
            {rangeData.startDate}: {symbol}
            {rangeData.startPrice}
            <br />
            {rangeData.endDate}: {symbol}
            {rangeData.endPrice}
          </p>
        </div>
        <div className="flex-item">
          <p className="quote-tiny" style={{ textAlign: 'right' }}>
            low: {symbol}
            {rangeData.minPrice} on {rangeData.minPriceDate}
            <br />
            high: {symbol}
            {rangeData.maxPrice} on {rangeData.maxPriceDate}
          </p>
        </div>
      </div>
    </div>
  );
};

LineGraphCaption.propTypes = {
  currencyPair: PropTypes.string.isRequired,
  rangeData: PropTypes.shape({
    endDate: PropTypes.string.isRequired,
    endPrice: PropTypes.string.isRequired,
    maxPrice: PropTypes.string.isRequired,
    maxPriceDate: PropTypes.string.isRequired,
    minPrice: PropTypes.string.isRequired,
    minPriceDate: PropTypes.string.isRequired,
    numDays: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    startPrice: PropTypes.string.isRequired,
  }).isRequired,
  symbol: PropTypes.string.isRequired,
};

export default LineGraphCaption;
