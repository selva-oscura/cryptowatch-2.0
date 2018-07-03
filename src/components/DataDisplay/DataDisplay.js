import React from 'react';
import { currencyAbbreviations } from '../../fixtures/currencies.js';
import {
  countDays,
  formatDateFromTimestamp,
  formatPrice,
} from '../../utils/utils';
import CurrentQuote from './CurrentQuote';
import Historical from './Historical';
import PropTypes from 'prop-types';

const DataDisplay = ({ selectedCurrencies, current, historical, symbols }) => {
  let historicalKeys = Object.keys(historical),
    historicalCloseData = {},
    historicalRange = {};

  // prepare data for Historical
  historicalKeys.forEach(currencyPair => {
    let maxPrice = -Infinity,
      maxPriceDate,
      minPrice = Infinity,
      minPriceDate;
    const startPrice = historical[`${currencyPair}`][0].close,
      startDate = historical[`${currencyPair}`][0].time,
      endPrice =
        historical[`${currencyPair}`][historical[`${currencyPair}`].length - 1]
          .close,
      endDate =
        historical[`${currencyPair}`][historical[`${currencyPair}`].length - 1]
          .time;

    // prepare series data for d3 LineGraph
    historicalCloseData[`${currencyPair}`] = historical[`${currencyPair}`].map(
      point => [point.time, point.close]
    );

    // prepare range data for LineGraphCaption
    historical[`${currencyPair}`].forEach(point => {
      if (point.low < minPrice) {
        minPrice = point.low;
        minPriceDate = point.time;
      }
      if (point.high > maxPrice) {
        maxPrice = point.high;
        maxPriceDate = point.time;
      }
    });
    historicalRange[`${currencyPair}`] = {
      maxPrice: formatPrice(maxPrice),
      maxPriceDate: formatDateFromTimestamp(maxPriceDate),
      minPrice: formatPrice(minPrice),
      minPriceDate: formatDateFromTimestamp(minPriceDate),
      startPrice: formatPrice(startPrice),
      startDate: formatDateFromTimestamp(startDate),
      endPrice: formatPrice(endPrice),
      endDate: formatDateFromTimestamp(endDate),
      numDays: countDays(startDate, endDate),
    };
  });

  // prepare data for CurrentQuote
  const getCryptoLongName = currencyPair =>
    currencyAbbreviations.fromCurrencies[
      currencyPair.slice(0, currencyPair.indexOf('-'))
    ];

  const getCryptoShortName = currencyPair =>
    currencyPair.slice(0, currencyPair.indexOf('-'));

  const getCurrentPrice = currencyPair => {
    return current[currencyPair] && current[currencyPair].price
      ? formatPrice(current[currencyPair].price)
      : undefined;
  };

  const getYesterdayClose = currencyPair => {
    return historical && historical[currencyPair]
      ? historical[currencyPair][historical[currencyPair].length - 1].close
      : undefined;
  };

  const calculatePriceChange = currencyPair => {
    let yesterdayClose = getYesterdayClose(currencyPair);
    let currentPrice =
      current[currencyPair] && current[currencyPair].price
        ? current[currencyPair].price
        : undefined;
    return yesterdayClose && currentPrice
      ? (100 * (currentPrice - yesterdayClose)) / yesterdayClose
      : undefined;
  };

  const getPriceChange = currencyPair => {
    const priceChange = calculatePriceChange(currencyPair);
    return priceChange !== undefined
      ? Math.abs(priceChange).toFixed(3) + '%'
      : undefined;
  };

  const getPriceDir = currencyPair => {
    const priceChange = calculatePriceChange(currencyPair);
    if (priceChange > 0) {
      return 'up';
    }
    if (priceChange < 0) {
      return 'down';
    }
    return 'no-change';
  };

  const getSymbol = (currencyPair, fromOrTo) => {
    if (symbols && fromOrTo === 'toCur') {
      return symbols[currencyPair.slice(currencyPair.indexOf('-') + 1)];
    }
    if (symbols && fromOrTo === 'fromCur') {
      return symbols[currencyPair.slice(0, currencyPair.indexOf('-'))];
    }
    return '';
  };

  return (
    <div className="DataDisplay">
      {selectedCurrencies.display.map((currencyPair, i) => (
        <div className="full" key={selectedCurrencies.display[i]}>
          <div className="m-half s-full">
            <CurrentQuote
              key={i}
              cryptoShortName={getCryptoShortName(currencyPair)}
              cryptoLongName={getCryptoLongName(currencyPair)}
              currentPrice={getCurrentPrice(currencyPair)}
              priceDir={getPriceDir(currencyPair)}
              priceChange={getPriceChange(currencyPair)}
              symbol={getSymbol(currencyPair, 'toCur')}
            />
          </div>

          <div className="m-half s-full">
            {historical[currencyPair] && (
              <Historical
                key={i}
                currencyPair={currencyPair}
                seriesData={historicalCloseData[currencyPair]}
                rangeData={historicalRange[currencyPair]}
                symbol={getSymbol(currencyPair, 'toCur')}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

DataDisplay.propTypes = {
  current: PropTypes.objectOf(
    PropTypes.shape({
      fromCur: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      toCur: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  historical: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        close: PropTypes.number.isRequired,
        high: PropTypes.number.isRequired,
        low: PropTypes.number.isRequired,
        time: PropTypes.number.isRequired,
      }).isRequired
    ).isRequired
  ),
  selectedCurrencies: PropTypes.shape({
    display: PropTypes.arrayOf(PropTypes.string).isRequired,
    fromCur: PropTypes.object.isRequired,
    toCur: PropTypes.object.isRequired,
  }).isRequired,
  symbols: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default DataDisplay;
