import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import Cell from './cell';
import './gridStyles';

let pi = Math.PI;
let tau = Math.PI*2;

class Grid extends React.Component {
	constructor(props){
		super(props);

		// this.scale = d3.scaleLinear()
			// .domain();
		// this.xScale = d3.scaleLinear();
		// this.yScale = d3.scaleLinear();

		this.cellVerts = _.map(new Array(7), (a, i) => [Math.cos(i*tau/6), Math.sin(i*tau/6)]);

		this.cellShape = d3.line()
			.x(d => this.props.cellSize*d[0])
			.y(d => this.props.cellSize*d[1]);

		this.state = {
			cells: [],
			pan: {x: 0, y: 0},
		}
	}
	generateCells(width, height, size, vertical){
		console.log("Generating Cells: width=%s, height=%s, size=%s, vertical=%s", width, height, size, vertical);

		let cells = [];

		let squish = Math.sqrt(3)/2;

		if (vertical) {
			let SWAP = height;
			height = width;
			width = SWAP;
		}

		// let xr = vertical ? size*squish : size;
		// let yr = vertical ? size : size*squish;
		let xr = size;
		let yr = size*squish;

		let screenX = 0;
		let screenY = 0;
		let offset = false;

		let row = 0;
		let column = 0;

		let path = this.cellShape(this.cellVerts);
		let index = 0;

		while (screenY <= height+yr) {
			screenX = offset ? xr*3/2 : 0;

			column = 0;

			while (screenX <= width+xr) {
				let axialX = column*2+(row)%2;
				let axialY = (row-(column*2+row%2))/2;
				let key = ''+column+', '+row+'';
				// let label = index+': '+axialX+', '+axialY+'';
				cells.push({
					index,
					size,
					screenX,
					screenY: height-screenY,
					axialX,
					axialY,
					path,
					key,
				})

				screenX += xr*3;
				column++;
				index++;
			}

			offset = !offset;
			screenY += yr;
			row++;
		}

		console.log("Cell Generation Complete! Created %s cells", cells.length);

		return cells;
	}
	place(){
		if (this.container) {
			this.cellSize = this.props.cellSize;


			let width = this.container.clientWidth;
			let height = this.container.clientHeight;
			let aspect = height/width;

			console.log("Placing cells. width=%s, height=%s", width, height);

			d3.select(this.container)
				.select('svg')
					.attr('width', width)
					.attr('height', height);

			this.setState({
				...this.state,
				cells: this.generateCells(width, height, this.props.cellSize, this.props.vertical),
			});
		}
		else console.log("Attempting to place cells, but no container!");
	}
	componentDidMount(){
		console.log("Component mounted. Registering event listener");
		window.addEventListener('resize', this.place.bind(this));
		this.place();
	}
	mount(div){

		this.container = div;
		if (this.cellSize != this.props.cellSize) this.place();
		/*
		if (div && this.container == null) {
			let width = div.clientWidth;
			let height = div.clientHeight;
			let aspect = height/width;

			if (width == 0 || height == 0) {
				this.setState(this.state);
			}
			else if (width != this.width || height != this.height) {
				this.container = div;
				// this.xScale.range([0, width]);
				// this.yScale.range([height, 0]);
				this.width = width;
				this.height = height;
				this.aspect = aspect;

				d3.select(div)
					.select('svg')
						.attr('width', width)
						.attr('height', height);

				this.setState({
					...this.state,
					cells: this.generateCells(width, height, this.props.cellSize, this.props.vertical),
				});
			}
		}
		*/
	}
	render(){
		let {
			vertical,
			cellSize,
			xInterval,
			yInterval,
			noteRange,
			synth,
			rootNoteIndex,
			scaleIndex,
			scaleBools,
		} = this.props;

		let {
			cells,
		} = this.state;

		let shape = this.cellShape;
		let verts = this.cellVerts;


		// if (this.width && this.height && this.cellSize != cellSize)
		
		return (
			<div className='grid'
				style={{
					flexGrow: 1,
					userSelect: 'none',
					position: 'relative',
				}}
				ref={this.mount.bind(this)}
				>
				<svg style={{
						position: 'absolute',
						top: 0,
						left: 0,
					}}
					>
					{_.map(cells, c => React.createElement(Cell, {
						...c,
						xInterval,
						yInterval,
						noteRange,
						synth,
						rootNoteIndex,
						scaleIndex,
						scaleBools,
					}))}
				</svg>
			</div>
		);
	}
}

export default Grid;