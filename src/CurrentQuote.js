import React from 'react';
import CCC from './utils/ccc-streamer-utilities.js';

const CurrentQuote = ({current, yesterday}) => {
	let yesterdayClose, priceChange;
	const currencies = {
		"USD" : "US Dollar",
		"EUR" : "Euros",
		"BTC" : "BitCoin",
		"ETH" : "Ethereum",
	}
	const fromCurrency = currencies[current.FROMSYMBOL] || "flesh out currency list!";
	if (yesterday) {
		yesterdayClose = yesterday[yesterday.length-1].close;
	}
	if (yesterdayClose) {
		priceChange = (100 * ((current.PRICE - yesterdayClose) / yesterdayClose)).toFixed(2); 
	} else {
		priceChange = "--";
	}

	return (
		<div className="CurrentQuote">
			<div className="third">
				<p className="quote-normal">{current.FROMSYMBOL}</p>
				<p className="quote-tiny">{fromCurrency}</p>
			</div>
			<div className="third">
				<p className="quote-normal">{CCC.STATIC.CURRENCY.SYMBOL[current.TOSYMBOL]}{current.PRICE}</p>
				<p className="quote-tiny">Current Price</p>
			</div>
			<div className="third">
					{priceChange}
				<p className="quote-tiny">from yesterday&apos;s close</p>
			</div>

		</div>
	);
}

export default CurrentQuote;
