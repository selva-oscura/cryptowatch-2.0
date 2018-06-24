import React from 'react';
import LineGraph from './LineGraph';
import LineGraphCaption from './LineGraphCaption';
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

export default Historical;
