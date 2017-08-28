import React, { Component } from 'react';
import * as d3 from 'd3';
import './LineGraph.css';

const LineGraph = () => {
  // let data = [[0, 12], [89, 9], [12, 50]];
  let data = [[0, 12], [6, 9], [12, 50], [18, 500]];
  data = data.map(point => ([point[0], -point[1]]));
  console.log('data', data);
  let xScale = d3.scaleLinear()
  .domain(d3.extent(data, ([x, y]) => x))
  .range([0, 400]);

  let yScale = d3.scaleLinear()
  .domain(d3.extent(data, ([x, y]) => y))
  .range([0, 200]);

  const line = d3.line()
  .x(([x, y]) => xScale(x))
  .y(([x, y]) => yScale(y))
  return (
    <div className="LineGraph">
      <p className="caption">ETH</p>
      <svg width="400" height="200">
          <path style={{stroke: "grey", fill:"none"}}d={line(data)}></path>
      </svg>
    </div>
  );
}

export default LineGraph;
