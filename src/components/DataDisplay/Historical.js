import React from 'react';
import LineGraph from './LineGraph';
import LineGraphCaption from './LineGraphCaption';
import './Historical.css';

const Historical = ({ currencyPair, data, symbols }) => (
  <div className="Historical">
    <div className="container">
      <LineGraph data={data} />
      <LineGraphCaption
        currencyPair={currencyPair}
        data={data}
        symbols={symbols}
      />
    </div>
  </div>
);

export default Historical;
