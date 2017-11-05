import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
// import Tone from 'tone';

let baseFill = '#FFF';
let pressedFill = '#F80';
let disabledFill = '#668';

let noteStrings = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
let noteStringsFromC = _.map(noteStrings, (s, i) => noteStrings[(i+3)%12]);

let mouseDown = false;

class Cell extends React.Component {
	constructor(props){
		super(props);

		/*
		this.synth = new Tone.Synth({
			"oscillator" : {
				"type" : "pwm",
				"modulationFrequency" : 0.2
			},
			"envelope" : {
				"attack" : 0.02,
				"decay" : 0.1,
				"sustain" : 0.2,
				"release" : 0.9,
			}
		}).toMaster();
		*/

		this.state = {
			pressed: false,
		}
	}
	click(){

	}
	enter(){
		if (mouseDown) this.press();
	}
	exit(){
		if (this.state.pressed) this.release();
	}
	down(){
		mouseDown = true;
		this.press();
	}
	up(){
		mouseDown = false;
		if (this.state.pressed) this.release();
	}
	press(){
		this.setState({
			...this.state,
			pressed: true,
		});
		this.props.synth.triggerAttack(this.getNoteString());
	}
	release(){
		this.setState({
			...this.state,
			pressed: false,
		});
		this.props.synth.triggerRelease(this.getNoteString());
	}
	getNoteIndex(){
		let {xInterval, yInterval, axialX, axialY} = this.props;
		return this.props.rootNoteIndex+xInterval*axialX+yInterval*axialY;
	}
	getNoteString(includeOctave=true){
		if (this.getDisabled()) return '';
		let index = this.getNoteIndex();
		let octave = Math.floor(index/12);
		return noteStringsFromC[index%12]+(includeOctave ? octave : '');
	}
	getDisabled(){
		let noteRange = this.props.noteRange;
		let noteIndex = this.getNoteIndex();
		return noteIndex < noteRange[0] || noteIndex >= noteRange[1];
	}
	render(){
		let {
			index,
			size,
			screenX,
			screenY,
			axialX,
			axialY,
			path,
			baseColor,
		} = this.props;

		let {
			pressed,
		} = this.state;


		// let label = axialX+', '+axialY+'';
		let label = this.getNoteString(false);
		// let label = this.getNoteIndex();
		let disabled = this.getDisabled();

		return (
			<g className='cell'
				// onClick={this.click.bind(this)}
				// onTouchStart={this.down.bind(this)}
				// onTouchEnd={this.up.bind(this)}
				onMouseDown={this.down.bind(this)}
				onMouseUp={this.up.bind(this)}
				onMouseEnter={this.enter.bind(this)}
				onMouseLeave={this.exit.bind(this)}
				transform={'translate('+screenX+', '+screenY+')'}
				style={{
					cursor: disabled ? 'default' : 'pointer',
					pointerEvents: disabled ? 'none' : 'auto',
					userSelect: 'none',
					transition: '0.2s',
				}}
				>
				<path d={path}
					stroke={'#000'}
					strokeWidth={1}
					fill={disabled ? disabledFill :
							pressed ? pressedFill :
								baseFill
					}
					style={{
					}}
					/>
				<text className='cellText'
					alignmentBaseline='middle'
					textAnchor='middle'
					fontSize={size/3}
					style={{
					}}
					>
					{label}
				</text>
			</g>
		);
	}
}

export default Cell;