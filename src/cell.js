import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
// import Tone from 'tone';

let ivoryFill = '#FFF';
let tonicFill = '#DDD';
let ebonyFill = '#222';
let pressedFill = '#F80';
let disabledFill = '#668';

let noteStrings = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
let noteStringsFromC = _.map(noteStrings, (s, i) => noteStrings[(i+3)%12]);

let mouseDown = false;
let touchEvents = false;

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
	enter(e){
		if (mouseDown) this.press();
	}
	exit(e){
		if (this.state.pressed) this.release();
	}
	down(e){
		if (!this.state.pressed) {
			this.press();
		}
		e.preventDefault();
	}
	up(e){
		if (this.state.pressed) this.release();
	}
	touchDown(e){
		touchEvents = true;
		this.down(e);
	}
	touchUp(e){
		touchEvents = true;
		this.up(e);
	}
	mouseDown(e){
		if (!touchEvents) {
			mouseDown = true;
			this.down(e);
		}
		else e.preventDefault();
	}
	mouseUp(e){
		if (!touchEvents) {
			mouseDown = false;
			this.up(e);
		}
		else e.preventDefault();
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
			scaleIndex,
			scaleBools,
		} = this.props;

		let {
			pressed,
		} = this.state;

		let noteIndex = this.getNoteIndex();
		let ivory = scaleBools[(noteIndex-scaleIndex)%scaleBools.length];
		let tonic = (noteIndex-scaleIndex)%scaleBools.length == 0;
		// let label = axialX+', '+axialY+'';
		let label = this.getNoteString(false);
		// let label = this.getNoteIndex();
		let disabled = this.getDisabled();

		return (
			<g className='cell'
				// onClick={this.click.bind(this)}
				onTouchStart={this.touchDown.bind(this)}
				onTouchEnd={this.touchUp.bind(this)}
				onTouchCancel={this.touchUp.bind(this)}
				onMouseDown={this.mouseDown.bind(this)}
				onMouseUp={this.mouseUp.bind(this)}
				onMouseEnter={this.enter.bind(this)}
				onMouseLeave={this.exit.bind(this)}
				transform={'translate('+screenX+', '+screenY+')'}
				style={{
					cursor: disabled ? 'default' : 'pointer',
					pointerEvents: disabled ? 'none' : 'auto',
					userSelect: 'none',
					// transition: '0.2s',
				    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
				    MozTapHighlightColor: 'rgba(0, 0, 0, 0)',
				}}
				>
				<path d={path}
					stroke={'#000'}
					strokeWidth={1}
					fill={disabled ? disabledFill :
							pressed ? pressedFill :
								tonic ? tonicFill :
									ivory ? ivoryFill :
										ebonyFill
					}
					style={{
						transition: '0.1s',
					}}
					/>
				<text className='cellText'
					alignmentBaseline='middle'
					textAnchor='middle'
					fontSize={size/2}
					style={{
						color: '#666',
						opacity: 0.2,
					}}
					>
					{label}
				</text>
			</g>
		);
	}
}

export default Cell;