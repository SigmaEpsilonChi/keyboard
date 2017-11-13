import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import Rudder from './rudder';
import './menuStyles';

let noteStrings = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
let noteStringsFromC = _.map(noteStrings, (s, i) => noteStrings[(i+3)%12]);

let rightIcon = require('./img/right.png');
let leftIcon = require('./img/left.png');
let menuIcon = require('./img/menu.png');
let closeIcon = require('./img/close.png');

class Menu extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			open: false,
		}
	}
	setOpen(open){
		this.setState({
			...this.state,
			open,
		})
	}
	render(){
		let {
			vertical,
			cellSize,
			xInterval,
			yInterval,
			noteRange,
			rootNoteIndex,
			scaleIndex,

			synthId,
			setSynth,
			setCellSize,
			setRootNoteIndex,
			setScaleIndex,
		} = this.props;

		let {
			open,
		} = this.state;

		return (
			<div className='menuContainer'>
				{!open ?
				<div className='openButton' onClick={this.setOpen.bind(this, !open)}><div><img src={require('./img/menu.png')}/></div></div> :

				<div className='menu'>
					<div className='openButton' onClick={this.setOpen.bind(this, !open)}><div><img src={require('./img/close.png')}/></div></div> :
					{React.createElement(Rudder, {label: 'Key Size', callback: setCellSize, value: cellSize, interval: 5})}
					{React.createElement(Rudder, {label: 'Synth', callback: setSynth, value: synthId, interval: 0})}
					{React.createElement(Rudder, {label: 'Scale Root', callback: setScaleIndex, value: scaleIndex, valueString: noteStringsFromC[scaleIndex%12]})}
					{React.createElement(Rudder, {label: 'Lowest Note', callback: setRootNoteIndex, value: rootNoteIndex})}
					<div className='blurb'>
						<div>
							This is a very rough keyboard that I hacked together in a weekend, mainly for my own reference as a music theory tool.
						</div>
						<div>
							I would like to come back and add more synth options, a scale editor, different kinds of grids, and lots of other features to illuminate the geometry of music as explored by theorists like David Lewin, Leonhard Euler, and Stanley Jordan (among others). Unfortunately my time is limited right now, so this is all I have for the moment.
						</div>
						<div>
							Thanks for playing!
						</div>
					</div>
				</div>
				}
			</div>
		);
	}
}

export default Menu;