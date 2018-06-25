import React from 'react';
import { scaleLinear, extent, line } from 'd3';
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

export default LineGraph;
