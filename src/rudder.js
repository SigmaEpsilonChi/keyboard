import React from 'react';

let Rudder = props => {
	let {
		interval = 1,
		value,
		label,
		callback,
		valueString = null,
	} = props;

	if (valueString == null) valueString = value.toString();

	return (
		<div className='rudder'
			>
			<div className='label'>
				<div className='labelName'>{label}</div>
				<div className='labelValue'>{valueString}</div>
			</div>
			<div className='buttons'>
				<div className='button' onClick={() => callback(interval == 0 ? -1 : (value-interval))}><div><img src={require('./img/left.png')}/></div></div>
				<div className='button' onClick={() => callback(interval == 0 ?  1 : (value+interval))}><div><img src={require('./img/right.png')}/></div></div>
			</div>
		</div>
	);
}

export default Rudder;