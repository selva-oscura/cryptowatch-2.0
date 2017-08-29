import React from 'react';
import './CurrencyButton.css';

const CurrencyButton = ({currency, selected, fromOrTo}) => {
	const keys = Object.keys(currency);
	const buttonClass = selected.includes(keys[0]) ? "currency-selected" : "currency-unselected";
	const handleClick = () => {
		console.log(keys[0], fromOrTo);
	}
	return (
		<button
			className={buttonClass}
			onClick={handleClick}
		>
			{currency[keys[0]]} ({keys[0]})
		</button>
	)
}

export default CurrencyButton;
