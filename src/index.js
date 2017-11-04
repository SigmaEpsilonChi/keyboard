import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Board from './board';
import './mainStyles';

let root = d3.select('body')
  .append('div')
    .attr('class', 'root');

ReactDOM.render(<Board/>, root.node());