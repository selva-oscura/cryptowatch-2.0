import React from 'react';
import LineGraph from './LineGraph';
import LineGraphCaption from './LineGraphCaption';
import './Historical.css';

const Historical = ({ currencyPair, seriesData, rangeData, symbols }) => (
  <div className="Historical">
    <div className="container">
      <LineGraph data={seriesData} />
      <LineGraphCaption
        currencyPair={currencyPair}
        rangeData={rangeData}
        symbols={symbols}
      />
    </div>
  </div>
);

export default Historical;
