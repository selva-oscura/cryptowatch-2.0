import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import initialState from './initialState';
import CCC from '../api/ccc-streamer-utilities.js';
import Offline from './Offline';
import CurrencySelection from './CurrencySelection/CurrencySelection';
import DataDisplay from './DataDisplay/DataDisplay';
import {
  createNewDateTimeString,
  convertBooleanObjToTrueOnlyArray,
} from '../utils/utils';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // set state from localStorage data or default initialState
    const cryptoglance =
      localStorage && localStorage.cryptoglance
        ? localStorage.cryptoglance
        : null;
    const state = cryptoglance ? JSON.parse(cryptoglance) : initialState;
    this.state = state;

    // save state to localStorage if possible but not yet stored (on 1st visit)
    if (localStorage && !localStorage.cryptoglance) {
      localStorage.cryptoglance = JSON.stringify(state);
    }

    // bind event handlers
    this.updateSelectedCurrencies = this.updateSelectedCurrencies.bind(this);
  }

  // update state and localStorage
  updateStateAndLocalStorage(state) {
    this.setState(state);
    if (localStorage) {
      localStorage.cryptoglance = JSON.stringify(state);
    }
  }

  generateHistoricalDataFetches(fromCur, toCur) {
    // standardize fromCur and toCur data as array if data arrives as object with currency keys and true/false values
    fromCur = Array.isArray(fromCur)
      ? fromCur
      : convertBooleanObjToTrueOnlyArray(fromCur);
    toCur = Array.isArray(toCur)
      ? toCur
      : convertBooleanObjToTrueOnlyArray(toCur);

    fromCur.forEach(fCur => {
      toCur.forEach(tCur => {
        this.fetchHistoricalData(fCur, tCur);
      });
    });
  }

  fetchHistoricalData(fCur, tCur) {
    this.queryCryptoCompareHistoryData(`fsym=${fCur}&tsym=${tCur}`)
      .then(response => {
        if (response.status === 200) {
          const timestamp = createNewDateTimeString();
          let historical = { ...this.state.data.historical };
          historical[`${fCur}-${tCur}`] = response.data.Data.map(d => {
            return { close: d.close, time: d.time, high: d.high, low: d.low };
          });
          const state = {
            ...this.state,
            data: {
              ...this.state.data,
              historical,
            },
            offline: false,
            timestamp,
          };
          this.updateStateAndLocalStorage(state);
        }
      })
      .catch(error => {
        const state = {
          ...this.state,
          offline: true,
        };
        this.updateStateAndLocalStorage(state);
      });
  }

  generateCurrentQuoteSubscriptionsList(fromCur, toCur) {
    const subscriptions = [];
    // standardize fromCur and toCur data as array if data arrives as object with currency keys and true/false values
    fromCur = Array.isArray(fromCur)
      ? fromCur
      : convertBooleanObjToTrueOnlyArray(fromCur);
    toCur = Array.isArray(toCur)
      ? toCur
      : convertBooleanObjToTrueOnlyArray(toCur);

    fromCur.forEach(fCur => {
      toCur.forEach(tCur => {
        subscriptions.push(`5~CCCAGG~${fCur}~${tCur}`);
      });
    });
    return subscriptions;
  }

  updateCurrentQuoteSubscriptions(subscriptions, addOrRemove) {
    // get current (current quotes object) in state
    let { current } = this.state.data;

    // instantiate socket
    const socket = io.connect('https://streamer.cryptocompare.com/');

    if (subscriptions.length) {
      if (addOrRemove === 'add') {
        socket.emit('SubAdd', { subs: subscriptions });
      } else if (addOrRemove === 'remove') {
        socket.emit('SubRemove', { subs: subscriptions });
      } else {
        console.log(
          `updateCurrentQuoteSubscriptions called without addOrRemove ('${addOrRemove}' was passed)`
        );
      }
    }

    // listen to socket for subscribed data & update state
    socket.on('m', message => {
      let res = {},
        messageType = message.slice(0, message.indexOf('~'));
      if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);

        // check if response has all needed fields
        if (res.LASTUPDATE && res.PRICE && res.FROMSYMBOL && res.TOSYMBOL) {
          // only update state.current if there is a change in price (or if this is first current data received)
          if (
            !current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] ||
            current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`].price !== res.PRICE
          ) {
            current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] = {
              price: res.PRICE,
              fromCur: res.FROMSYMBOL,
              toCur: res.TOSYMBOL,
            };
            const timestamp = createNewDateTimeString();
            const state = {
              ...this.state,
              data: {
                ...this.state.data,
                current,
              },
              offline: false,
              timestamp,
            };
            this.updateStateAndLocalStorage(state);
          }
        }
      }
    });

    // listen for lost connection and trigger offline notice
    socket.on('connect_error', () => {
      const state = {
        ...this.state,
        offline: true,
      };
      this.updateStateAndLocalStorage(state);
    });
  }

  updateSelectedCurrenciesState(selectedCurrencies) {
    // use currencyMasterlists as template for ordering display
    const { fromCurrencies, toCurrencies } = this.state.currencyMasterlists;
    const display = [];
    const mapSelectedCurrencies = (masterList, selected) => {
      return masterList
        .map(curr => Object.keys(curr)[0])
        .filter(c => selected[c]);
    };

    const sortedSelectedFromCurrencies = mapSelectedCurrencies(
      fromCurrencies,
      selectedCurrencies.fromCur
    );
    const sortedSelectedToCurrencies = mapSelectedCurrencies(
      toCurrencies,
      selectedCurrencies.toCur
    );

    sortedSelectedFromCurrencies.forEach(fCur => {
      sortedSelectedToCurrencies.forEach(tCur => {
        display.push(`${fCur}-${tCur}`);
      });
    });

    const state = {
      ...this.state,
      selectedCurrencies: {
        ...selectedCurrencies,
        display,
      },
    };
    this.updateStateAndLocalStorage(state);
  }

  bootstrapData() {
    const { fromCur, toCur } = this.state.selectedCurrencies;
    const subscriptions = this.generateCurrentQuoteSubscriptionsList(
      fromCur,
      toCur
    );
    this.updateCurrentQuoteSubscriptions(subscriptions, 'add');
    this.generateHistoricalDataFetches(fromCur, toCur);
    this.updateSelectedCurrenciesState({ fromCur, toCur });
  }

  updateSelectedCurrencies(clickedCurrency, fromOrTo) {
    const selectedCurrencies = {
      fromCur: { ...this.state.selectedCurrencies.fromCur },
      toCur: { ...this.state.selectedCurrencies.toCur },
    };

    // create list of subscriptions to update
    let subscriptions = [];
    if (fromOrTo === 'fromCur') {
      // subscription updates for fromCur (cryptocurrencies)
      subscriptions = this.generateCurrentQuoteSubscriptionsList(
        [clickedCurrency],
        selectedCurrencies.toCur
      );
    } else {
      // subscription updates for toCur ('real' currencies)
      subscriptions = this.generateCurrentQuoteSubscriptionsList(
        selectedCurrencies.fromCur,
        [clickedCurrency]
      );
    }

    if (selectedCurrencies[fromOrTo][clickedCurrency]) {
      // remove subscriptions for deselected currency
      this.updateCurrentQuoteSubscriptions(subscriptions, 'remove');
    } else {
      // add subscriptions and fetch history for newly selected currencies
      this.updateCurrentQuoteSubscriptions(subscriptions, 'add');
      // selectedCurrencies[fromOrTo].push(clickedCurrency);
      if (fromOrTo === 'fromCur') {
        // fetch historical data for newly selected cryptocurrency and all currently selected real currencies
        this.generateHistoricalDataFetches(
          [clickedCurrency],
          selectedCurrencies.toCur
        );
      } else {
        // fetch historical data for newly selected real currency and all currently selected cryptocurrencies
        this.generateHistoricalDataFetches(selectedCurrencies.fromCur, [
          clickedCurrency,
        ]);
      }
    }
    // updates to selectedCurrencies
    selectedCurrencies[fromOrTo][clickedCurrency] = !selectedCurrencies[
      fromOrTo
    ][clickedCurrency];
    this.updateSelectedCurrenciesState(selectedCurrencies);
  }

  clearAllSubscriptions() {
    const { fromCur, toCur } = this.state.selectedCurrencies;
    const subscriptions = this.generateCurrentQuoteSubscriptionsList(
      convertBooleanObjToTrueOnlyArray(fromCur),
      convertBooleanObjToTrueOnlyArray(toCur)
    );
    this.updateCurrentQuoteSubscriptions(subscriptions, 'remove');
  }

  queryCryptoCompareHistoryData(currencyPair) {
    const apiCall = `https://min-api.cryptocompare.com/data/histoday?${currencyPair}&limit=60&aggregate=3&e=CCCAGG`;
    return axios
      .get(apiCall)
      .then(response => response)
      .catch(error => {
        throw error;
      });
  }

  componentWillMount() {
    // fetch historical data and subscribe to streaming quotes
    this.bootstrapData();
  }

  componentWillUnmount() {
    // unsubscribe from streaming quotes
    this.clearAllSubscriptions();
  }

  render() {
    const {
      currencyMasterlists,
      data,
      selectedCurrencies,
      offline,
      timestamp,
    } = this.state;
    const { current, historical } = data;
    const { fromCur, toCur } = selectedCurrencies;

    return (
      <div className="App">
        <div className="wrapper">
          <div className="App-header">
            <h2>CryptoGlance</h2>
          </div>

          <div className="App-body">
            <CurrencySelection
              currencyMasterlists={currencyMasterlists}
              selectedFromCurrencies={fromCur}
              selectedToCurrencies={toCur}
              updateSelectedCurrencies={this.updateSelectedCurrencies}
            />
            {offline && timestamp && <Offline timestamp={timestamp} />}
            <DataDisplay
              selectedCurrencies={selectedCurrencies}
              current={current}
              historical={historical}
              symbols={CCC.STATIC.CURRENCY.SYMBOL}
            />
          </div>
          {/* end of App-body */}
        </div>
        {/* end of wrapper */}
      </div>
    );
  }
}

export default App;
