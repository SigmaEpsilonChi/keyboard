import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import Grid from './grid';
import Menu from './menu';
import Tone from 'tone';

let synthConfigs = {
	buzzz: {
		constructor: Tone.Synth,
		spec: {
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
		}
	},
	boop: {
		constructor: Tone.Synth,
		spec: {
			"oscillator": {
				"detune": 0,
				"type": "custom",
				"partials" : [2, 1, 2, 2],
				"phase": 0,
				"volume": 0
			},
			"envelope": {
				"attack": 0.005,
				"decay": 0.3,
				"sustain": 0.2,
				"release": 1,
			},
			"portamento": 0.01,
			"volume": -20
		}
	},
	bzzrt: {
		constructor: Tone.Synth,
		spec: {
			"oscillator" : {
				"type" : "square"
			},
			"envelope" : {
				"attack" : 0.01,
				"decay" : 0.2,
				"sustain" : 0.2,
				"release" : 0.2,
			}
		}
	},
	donka: {
		constructor: Tone.MembraneSynth,
		spec: {
			"pitchDecay" : 0.008,
			"octaves" : 2,
			"envelope" : {
				"attack" : 0.0006,
				"decay" : 0.5,
				"sustain" : 0
			}
		}
	},
	woop: {
		constructor: Tone.FMSynth,
		spec: {
			"modulationIndex" : 12.22,
			"envelope" : {
				"attack" : 0.01,
				"decay" : 0.2
			},
			"modulation" : {
				"type" : "square"
			},
			"modulationEnvelope" : {
				"attack" : 0.2,
				"decay" : 0.01
			}
		}
	},
}

class Board extends React.Component {
	constructor(props){
		super(props);

		this.noteRange = [0, 120];

		let synthId = 'boop';
		let config = synthConfigs[synthId];
		let synth = new Tone.PolySynth(16, config.constructor, config.spec).toMaster();

		this.state = {
			vertical: false,
			cellSize: 80,
			xInterval: 4,
			yInterval: 7,
			rootNoteIndex: 20,
			scaleIndex: 0,
			scaleBools: [true, false, true, false, true, true, false, true, false, true, false, true],
			synth,
			synthId,
		}
	}
	setSynth(synthId){
		if (synthId == -1 || synthId == 1) {
			let keys = _.keys(synthConfigs);
			synthId = keys[(_.indexOf(keys, this.state.synthId)+keys.length+synthId)%keys.length];
		}

		let config = synthConfigs[synthId];

		this.state.synth.dispose();

		this.setState({
			...this.state,
			synthId,
			synth: new Tone.PolySynth(16, config.constructor, config.spec).toMaster(),
		});
	}
	setCellSize(cellSize){
		cellSize = Math.min(cellSize, 120);
		cellSize = Math.max(cellSize, 20);
		console.log("Setting cell size to %s", cellSize);
		this.setState({
			...this.state,
			cellSize,
		});
	}
	setRootNoteIndex(rootNoteIndex){
		// rootNoteIndex = Math.max(rootNoteIndex, 0);
		this.setState({
			...this.state,
			rootNoteIndex,
		});
	}
	setScaleIndex(scaleIndex){
		// rootNoteIndex = Math.max(rootNoteIndex, 0);

		while (scaleIndex < 0) scaleIndex += 12;
		scaleIndex = scaleIndex%12;

		this.setState({
			...this.state,
			scaleIndex,
		});
	}
	playNote(note){

	}
	render(){
		let {
		} = this.props;

		let {
			vertical,
			cellSize,
			xInterval,
			yInterval,

			synth,
			synthId,
			scaleIndex,
			scaleBools,
			
			rootNoteIndex,
		} = this.state;

		let noteRange = this.noteRange;

		let playNote = this.playNote.bind(this);
		let setCellSize = this.setCellSize.bind(this);
		let setRootNoteIndex = this.setRootNoteIndex.bind(this);
		let setScaleIndex = this.setScaleIndex.bind(this);
		let setSynth = this.setSynth.bind(this);

		return (
			<div className='board'
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'stretch',
					width: '100%',
					height: '100%',
				}}
				>
				{React.createElement(Grid, {
					vertical,
					cellSize,
					playNote,
					xInterval,
					yInterval,
					noteRange,

					synth,
					scaleIndex,
					scaleBools,
					rootNoteIndex,
				})}
				{React.createElement(Menu, {
					vertical,
					cellSize,
					playNote,
					xInterval,
					yInterval,
					noteRange,

					synthId,
					rootNoteIndex,
					scaleIndex,
					scaleBools,

					setSynth,
					setCellSize,
					setScaleIndex,
					setRootNoteIndex,
				})}
			</div>
		);
	}
}

export default Board;