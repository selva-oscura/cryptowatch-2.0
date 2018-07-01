import { allCurrencies } from '../fixtures/currencies.js';
import { createNewDateTimeString } from '../utils/utils';

const initializeSelected = (allCurr, selectedCurr = []) => {
  const currenciesObject = {};
  allCurr.forEach(curr => {
    Object.keys(curr).forEach(key => (currenciesObject[key] = false));
  });
  selectedCurr.forEach(key => (currenciesObject[key] = true));
  return currenciesObject;
};

const initialState = {
  currencyMasterlists: allCurrencies,
  data: {
    current: {},
    historical: {},
  },
  selectedCurrencies: {
    fromCur: initializeSelected(allCurrencies.fromCurrencies, ['BTC', 'ETH']),
    toCur: initializeSelected(allCurrencies.toCurrencies, ['USD']),
    display: [],
  },
  offline: false,
  timestamp: createNewDateTimeString(),
};

export default initialState;
