import React from 'react';
import PropTypes from 'prop-types';
import CurrencyButton from './CurrencyButton';

const CurrencySelection = ({
  allCurrencies,
  selectedFromCurrencies,
  selectedToCurrencies,
  updateSelectedCurrencies,
}) => (
  <div className="CurrencySelection">
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

CurrencySelection.propTypes = {
  allCurrencies: PropTypes.shape({
    fromCurrencies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
      .isRequired,
    pairingOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    toCurrencies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
      .isRequired,
  }),
  selectedFromCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedToCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateSelectedCurrencies: PropTypes.func.isRequired,
};

export default CurrencySelection;
