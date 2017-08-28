import React from 'react';

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
			<p>Currencies here</p>
		</div>
	);
};

export default Currencies;
