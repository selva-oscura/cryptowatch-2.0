import React, { Component } from 'react';
import { allCurrencies } from '../fixtures/currencies.js';
import axios from 'axios';
import io from 'socket.io-client';
import CCC from '../api/ccc-streamer-utilities.js';
import Offline from './Offline';
import Currencies from './Currencies';
import CurrentQuote from './CurrentQuote';
import LineGraph from './LineGraph';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    // set initial state from localStorage data or default
    const cryptoGlanceData =
      localStorage && localStorage.cryptoGlanceData
        ? localStorage.cryptoGlanceData
        : null;
    const timestamp = this.createNewDateTimeString();
    const state = cryptoGlanceData
      ? JSON.parse(cryptoGlanceData)
      : {
          allCurrencies,
          current: {},
          historical: {},
          selectedCurrencies: {
            fromCur: ['BTC', 'ETH'],
            toCur: ['USD'],
            display: [],
          },
          offline: false,
          timestamp,
        };
    this.state = state;
    // save state to localStorage if possible but not yet stored (on 1st visit)
    if (localStorage && !localStorage.cryptoGlanceData) {
      localStorage.cryptoGlanceData = JSON.stringify(state);
    }
    // bind event handlers
    this.updateSelectedCurrencies = this.updateSelectedCurrencies.bind(this);
  }

  // update state and localStorage
  updateStateAndLocalStorage(state) {
    this.setState(state);
    if (localStorage) {
      localStorage.cryptoGlanceData = JSON.stringify(state);
    }
  }

  generateHistoricalDataFetches(fromCur, toCur) {
    fromCur.forEach(f_cur => {
      toCur.forEach(t_cur => {
        this.fetchHistoricalData(f_cur, t_cur);
      });
    });
  }

  fetchHistoricalData(f_cur, t_cur) {
    this.queryCryptoCompareHistoryData(`fsym=${f_cur}&tsym=${t_cur}`)
      .then(response => {
        if (response.status === 200) {
          const timestamp = this.createNewDateTimeString();
          let { historical } = this.state;
          historical[`${f_cur}-${t_cur}`] = response.data.Data;
          const state = {
            ...this.state,
            offline: false,
            timestamp,
            historical,
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
    let subscriptions = [];
    fromCur.forEach(f_cur => {
      toCur.forEach(t_cur => {
        subscriptions.push(`5~CCCAGG~${f_cur}~${t_cur}`);
      });
    });
    return subscriptions;
  }

  updateCurrentQuoteSubscriptions(subscriptions, addOrRemove) {
    // get current (current quotes object) in state
    let { current } = this.state;
    // instantiate socket
    const socket = io.connect('https://streamer.cryptocompare.com/');

    // checking for bad/missing parameters
    if (
      !subscriptions ||
      !Array.isArray(subscriptions) ||
      !subscriptions.length
    ) {
      console.log(
        'updateCurrentQuoteSubscriptions called with bad/no subscriptions:',
        subscriptions,
        'subscriptions.length:',
        subscriptions.length
      );
    }

    if (addOrRemove === 'add') {
      socket.emit('SubAdd', { subs: subscriptions });
    } else if (addOrRemove === 'remove') {
      socket.emit('SubRemove', { subs: subscriptions });
    } else {
      console.log(
        `updateCurrentQuoteSubscriptions called without addOrRemove ('${addOrRemove}' was passed)`
      );
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
            current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] === undefined ||
            current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`].PRICE !== res.PRICE
          ) {
            current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] = res;
            const timestamp = this.createNewDateTimeString();
            const state = {
              ...this.state,
              offline: false,
              timestamp,
              current,
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

  updateDisplayedCurrencyPairings(selectedCurrencies) {
    let { allCurrencies } = this.state;
    // pairingOrder is a masterlist of currency pairs
    // used here to ensure currency pairings are always displayed in the same order
    selectedCurrencies.display = allCurrencies.pairingOrder.filter(item => {
      let divider = item.indexOf('-'),
        fromCur = item.slice(0, divider),
        toCur = item.slice(divider + 1);
      return selectedCurrencies.fromCur.includes(fromCur) &&
        selectedCurrencies.toCur.includes(toCur)
        ? item
        : null;
    });
    const state = {
      ...this.state,
      selectedCurrencies,
    };
    this.updateStateAndLocalStorage(state);
  }

  bootstrapData() {
    const { selectedCurrencies } = this.state;
    const subscriptions = this.generateCurrentQuoteSubscriptionsList(
      selectedCurrencies.fromCur,
      selectedCurrencies.toCur
    );
    this.updateCurrentQuoteSubscriptions(subscriptions, 'add');
    this.generateHistoricalDataFetches(
      selectedCurrencies.fromCur,
      selectedCurrencies.toCur
    );
    this.updateDisplayedCurrencyPairings(selectedCurrencies);
  }

  updateSelectedCurrencies(clickedCurrency, fromOrTo) {
    let { selectedCurrencies } = this.state;

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

    if (selectedCurrencies[fromOrTo].includes(clickedCurrency)) {
      // remove subscriptions for deselected currency
      this.updateCurrentQuoteSubscriptions(subscriptions, 'remove');
      selectedCurrencies[fromOrTo] = selectedCurrencies[fromOrTo].filter(
        item => (item !== clickedCurrency ? item : null)
      );
    } else {
      // add subscriptions and fetch history for newly selected currencies
      this.updateCurrentQuoteSubscriptions(subscriptions, 'add');
      selectedCurrencies[fromOrTo].push(clickedCurrency);
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
    this.updateDisplayedCurrencyPairings(selectedCurrencies);
  }

  clearAllSubscriptions() {
    const { selectedCurrencies } = this.state;
    const subscriptions = this.generateCurrentQuoteSubscriptionsList(
      selectedCurrencies.fromCur,
      selectedCurrencies.toCur
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

  createNewDateTimeString() {
    let d = new Date();
    return `${d.toLocaleDateString('en-US')} at ${d.toLocaleTimeString(
      'en-US'
    )}`;
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
    let { current, historical, selectedCurrencies } = this.state;
    let historicalKeys = Object.keys(historical),
      historicalCloseData = {};
    historicalKeys.forEach(currencyPair => {
      historicalCloseData[`${currencyPair}`] = historical[
        `${currencyPair}`
      ].map(point => [point.time, point.close]);
    });

    return (
      <div className="App">
        <div className="wrapper">
          <div className="App-header">
            <h2>CryptoGlance</h2>
          </div>

          <div className="App-body">
            <Currencies
              allCurrencies={allCurrencies}
              selectedFromCurrencies={selectedCurrencies.fromCur}
              selectedToCurrencies={selectedCurrencies.toCur}
              updateSelectedCurrencies={this.updateSelectedCurrencies}
            />
            {this.state.offline &&
              this.state.timestamp && (
                <Offline timestamp={this.state.timestamp} />
              )}
            {selectedCurrencies.display.map((currencyPair, i) => (
              <div className="full" key={selectedCurrencies.display[i]}>
                <div className="m-half s-full">
                  {current[currencyPair] && (
                    <CurrentQuote
                      key={i}
                      current={current[currencyPair]}
                      yesterday={historical[currencyPair]}
                    />
                  )}
                </div>

                <div className="m-half s-full LineGraphs">
                  {historical[currencyPair] && (
                    <LineGraph
                      key={i}
                      currencyPair={currencyPair}
                      data={historicalCloseData[currencyPair]}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* end of App-body */}
        </div>
        {/* end of wrapper */}
      </div>
    );
  }
}

export default App;
