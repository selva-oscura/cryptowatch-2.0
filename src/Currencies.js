import React from 'react';
import CurrencyButton from './CurrencyButton';

const Currencies = () => {
	const fromCurrencies = [
		{"BTC":  	"Bitcoin"},
		{"ETH": 	"Ethereum"},
		{"LTC": 	"Litecoin"},
		{"BCH": 	"Bitcoin Cash / BCC"},
		{"DASH": 	"Digital Cash"},
		{"EOS": 	"EOS"},
		{"ETC": 	"Ethereum Classic"},
		{"LSK": 	"Lisk"},
		{"IOT": 	"IOTA"},
		{"XMR": 	"Monero"},
		{"NEO": 	"NEO"},
		{"OMG": 	"OmiseGo"},
		{"XRP": 	"Ripple"},
		{"ZEC": 	"ZCASH"},
	];
	const toCurrencies = [
		{"USD": 	"US Dollar"},
		{"EUR": 	"Euro"},
		{"GBP": 	"British Pound"}
	];
	return (
		<div>
			<h2>Select Currencies:</h2>
			<div>
				<h3>Crypto-Currencies:</h3>
				<div className="currency-list">
					{fromCurrencies.map((currency, i) => (
						<CurrencyButton
							key={i}
							currency={currency}
						/>
					))}
				</div>
			</div>
			<div>
				<h3>
					Base Currencies:<br />
					(price in terms of these currencies)
				</h3>
				<div className="currency-list">
					{toCurrencies.map((currency, i) => (
						<CurrencyButton
							key={i}
							currency={currency}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Currencies;
