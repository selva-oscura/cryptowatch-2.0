import React from 'react';
import PropTypes from 'prop-types';
import CurrencyButton from './CurrencyButton';

const CurrencySelection = ({
  currencyMasterlists,
  selectedFromCurrencies,
  selectedToCurrencies,
  updateSelectedCurrencies,
}) => (
  <div className="CurrencySelection">
    <h2>Select Currencies</h2>
    <div className="full">
      <h3 className="text-left">Crypto-Currencies:</h3>
      <div className="currency-list">
        {currencyMasterlists.fromCurrencies.map((currency, i) => (
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
        {currencyMasterlists.toCurrencies.map((currency, i) => (
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

CurrencySelection.propTypes = {
  currencyMasterlists: PropTypes.shape({
    fromCurrencies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
      .isRequired,
    toCurrencies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
      .isRequired,
  }),
  selectedFromCurrencies: PropTypes.object.isRequired,
  selectedToCurrencies: PropTypes.object.isRequired,
  updateSelectedCurrencies: PropTypes.func.isRequired,
};

export default CurrencySelection;
