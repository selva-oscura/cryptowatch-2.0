import React from 'react';

const CurrencyButton = ({currency, selected}) => {
	let keys = Object.keys(currency);
	let buttonClass = selected.includes(keys[0]) ? "currency-selected" : "currency-unselected";
	return (
		<button
			className={buttonClass}
		>
			{currency[keys[0]]} ({keys[0]})
		</button>
	)
}

export default CurrencyButton;
