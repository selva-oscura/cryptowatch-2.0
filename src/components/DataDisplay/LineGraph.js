import React from 'react';
import { scaleLinear, extent, line } from 'd3';
import PropTypes from 'prop-types';
import './LineGraph.css';

const LineGraph = ({ data }) => {
  // prepare data for d3
  data = data.map(point => [point[0], -point[1]]);

  // d3 line chart
  let xScale = scaleLinear()
    .domain(extent(data, ([x, y]) => x))
    .range([0, 400]);
  let yScale = scaleLinear()
    .domain(extent(data, ([x, y]) => y))
    .range([0, 200]);
  const lineChart = line()
    .x(([x, y]) => xScale(x))
    .y(([x, y]) => yScale(y));

  return (
    <div className="LineGraph">
      <svg width="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
        <path style={{ stroke: 'grey', fill: 'none' }} d={lineChart(data)} />
      </svg>
    </div>
  );
};

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

LineGraph.propTypes = {
  data: PropTypes.arrayOf(arrayOfTwoNumbers).isRequired,
};

export default LineGraph;
