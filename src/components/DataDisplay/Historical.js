import React from 'react';
import LineGraph from './LineGraph';
import LineGraphCaption from './LineGraphCaption';
import PropTypes from 'prop-types';
import './Historical.css';

const Historical = ({ currencyPair, seriesData, rangeData, symbol }) => (
  <div className="Historical">
    <div className="container">
      <LineGraph data={seriesData} />
      <LineGraphCaption
        currencyPair={currencyPair}
        rangeData={rangeData}
        symbol={symbol}
      />
    </div>
  </div>
);

// custom propType function
function arrayOfTwoNumbers(props, propName, componentName) {
  const rightLength = props[propName].length === 2;
  const rightContent = props[propName].every(num => typeof num === 'number');
  return !rightLength || !rightContent
    ? new Error(
        `element ${propName} (${
          props[propName]
        }) in ${componentName} has length: ${
          props[propName].length
        } (expected 2) and numeric contents: ${rightContent} (expected true)`
      )
    : null;
}

Historical.propTypes = {
  currencyPair: PropTypes.string.isRequired,
  seriesData: PropTypes.arrayOf(arrayOfTwoNumbers).isRequired,
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

export default Historical;
