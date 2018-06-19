import React from 'react';
import * as d3 from 'd3';
import CCC from '../api/ccc-streamer-utilities.js';
import './LineGraph.css';

const LineGraph = ({ currencyPair, data }) => {
  let minPrice = Infinity,
    maxPrice = -Infinity,
    minPriceDate,
    maxPriceDate,
    [startDate, startPrice] = data[0],
    [endDate, endPrice] = data[data.length - 1],
    numDays = (endDate - startDate) / (24 * 60 * 60),
    currencySymbol;

  // calculate minPrice & maxPrice price and their corresponding dates
  data.forEach(point => {
    if (point[1] < minPrice) {
      minPrice = point[1];
      minPriceDate = point[0];
    }
    if (point[1] > maxPrice) {
      maxPrice = point[1];
      maxPriceDate = point[0];
    }
  });

  // format dates and prices
  const formatDateFromTimestamp = timestamp => {
    const date = new Date(timestamp * 1000);
    return `${(date.getMonth() % 12) + 1}/${date.getDate()}/${String(
      date.getFullYear()
    ).slice(-2)}`;
  };
  const formatPrice = price =>
    price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  console.log('minPrice before', minPrice);
  minPrice = formatPrice(minPrice);
  console.log('minPrice after', minPrice);
  maxPrice = formatPrice(maxPrice);
  minPriceDate = formatDateFromTimestamp(minPriceDate);
  maxPriceDate = formatDateFromTimestamp(maxPriceDate);
  startPrice = formatPrice(startPrice);
  endPrice = formatPrice(endPrice);
  startDate = formatDateFromTimestamp(startDate);
  endDate = formatDateFromTimestamp(endDate);
  // numDays = (endDate - startDate) / (24 * 60 * 60);

  // get currency symbol for real currency
  currencySymbol = CCC.STATIC.CURRENCY.SYMBOL[currencyPair.slice(-3)];

  // prepare data for d3
  data = data.map(point => [point[0], -point[1]]);
  let xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, ([x, y]) => x))
    .range([0, 400]);
  let yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, ([x, y]) => y))
    .range([0, 200]);
  const lineChart = d3
    .line()
    .x(([x, y]) => xScale(x))
    .y(([x, y]) => yScale(y));

  return (
    <div className="LineGraph">
      <div className="container">
        <svg width="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
          <path style={{ stroke: 'grey', fill: 'none' }} d={lineChart(data)} />
        </svg>
        <div className="caption">
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
                (last {numDays} days)
              </p>
            </div>
          </div>
          <div className="flex-container">
            <div className="flex-item">
              <p className="quote-tiny" style={{ textAlign: 'left' }}>
                {startDate}: {currencySymbol}
                {startPrice}
                <br />
                {endDate}: {currencySymbol}
                {endPrice}
              </p>
            </div>
            <div className="flex-item">
              <p className="quote-tiny" style={{ textAlign: 'right' }}>
                low: {currencySymbol}
                {minPrice} on {minPriceDate}
                <br />
                high: {currencySymbol}
                {maxPrice} on {maxPriceDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineGraph;
