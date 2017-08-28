import React from 'react';

const CurrencyButton = ({currency}) => {
	let keys = Object.keys(currency);
	return (
		<button
		>
			{currency[keys[0]]} ({keys[0]})
		</button>
	)
}

export default CurrencyButton;
