import React from 'react';
import { allCurrencies } from '../utils/currencies.js';
import CurrencyButton from './CurrencyButton';

const Currencies = ({
  selectedFromCurrencies,
  selectedToCurrencies,
  updateSelectedCurrencies,
}) => (
  <div>
    <h2>Select Currencies</h2>
    <div className="full">
      <h3 className="text-left">Crypto-Currencies:</h3>
      <div className="currency-list">
        {allCurrencies.fromCurrencies.map((currency, i) => (
          <CurrencyButton
            key={i}
            currency={currency}
            selected={selectedFromCurrencies}
            fromOrTo="fromCur"
            updateSelectedCurrencies={updateSelectedCurrencies}
          />
        ))}
      </div>
    </div>
    <div className="full">
      <h3 className="text-right">
        'Real' Currencies:<br />
        (price in terms of these currencies)
      </h3>
      <div className="currency-list">
        {allCurrencies.toCurrencies.map((currency, i) => (
          <CurrencyButton
            key={i}
            currency={currency}
            selected={selectedToCurrencies}
            fromOrTo="toCur"
            updateSelectedCurrencies={updateSelectedCurrencies}
          />
        ))}
      </div>
    </div>
  </div>
);

export default Currencies;
