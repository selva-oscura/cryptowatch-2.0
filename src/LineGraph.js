import React, { Component } from 'react';
import * as d3 from 'd3';



class LineGraph extends Component {

  render() {
    let data = [[0, 12], [89, 9], [12, 50]];
    let xScale = d3.scaleLinear()
    .domain(d3.extent(data, ([x, y]) => x))
    .range([0, 500]);

    let yScale = d3.scaleLinear()
    .domain(d3.extent(data, ([x, y]) => y))
    .range([0, 500]);

    
    const line = d3.line()
    .x(([x, y]) => xScale(x))
    .y(([x, y]) => yScale(y))
    return (
      <div className="LineGraph">
        <svg width="500" height="500">
            <path style={{stroke: "black", fill:"none"}}d={line(data)}></path>
        </svg>
      </div>
    );
  }
}

export default LineGraph;