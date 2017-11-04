import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import './toolbarStyles';

let noteStrings = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
let noteStringsFromC = _.map(noteStrings, (s, i) => noteStrings[(i+3)%12]);

class Toolbar extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			
		}
	}
	render(){
		let {
			vertical,
			cellSize,
			xInterval,
			yInterval,
			noteRange,
			rootNoteIndex,

			synthId,
			setSynth,
			setCellSize,
			setRootNoteIndex,
		} = this.props;

		let {
		} = this.state;

		return (
			<div className='toolbar'>
				<div className='rudder'>
					<div className='button' onClick={() => setCellSize(cellSize-10)}>{'<'}</div>
					<div className='label'>{'Key Size: '+cellSize}</div>
					<div className='button' onClick={() => setCellSize(cellSize+10)}>{'>'}</div>
				</div>
				<div className='rudder'>
					<div className='button' onClick={() => setRootNoteIndex(rootNoteIndex-1)}>{'<'}</div>
					<div className='label'>{'Root Note: '+rootNoteIndex}</div>
					<div className='button' onClick={() => setRootNoteIndex(rootNoteIndex+1)}>{'>'}</div>
				</div>
				<div className='rudder'>
					<div className='button' onClick={() => setSynth(-1)}>{'<'}</div>
					<div className='label'>{'Synth: '+synthId}</div>
					<div className='button' onClick={() => setSynth(1)}>{'>'}</div>
				</div>
			</div>
		);
	}
}

export default Toolbar;