import React from 'react';
import * as d3 from 'd3';
import CCC from './utils/ccc-streamer-utilities.js';
import './LineGraph.css';

const LineGraph = ({ currencyPair, data }) => {
  let min, max, numDays, currencySign;
  min = Infinity;
  max = -Infinity;
  data.forEach(point => {
    min = Math.min(min, point[1]);
    max = Math.max(max, point[1]);
  });
  numDays = (data[data.length - 1][0] - data[0][0]) / (24 * 60 * 60);
  currencySign = CCC.STATIC.CURRENCY.SYMBOL[currencyPair.slice(-3)];
  data = data.map(point => [point[0], -point[1]]);

  let xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, ([x, y]) => x))
    .range([0, 400]);

  let yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, ([x, y]) => y))
    .range([0, 200]);

  const line = d3
    .line()
    .x(([x, y]) => xScale(x))
    .y(([x, y]) => yScale(y));
  return (
    <div className="LineGraph">
      <div className="container">
        <div className="caption">
          <p className="quote-normal">{currencyPair}</p>
          <p className="quote-tiny">last {numDays} days</p>
          <p className="quote-tiny">
            {currencySign}
            {min.toFixed(2)} - {currencySign}
            {max.toFixed(2)}
          </p>
        </div>
        <svg width="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
          <path style={{ stroke: 'grey', fill: 'none' }} d={line(data)} />
        </svg>
      </div>
    </div>
  );
};

export default LineGraph;
