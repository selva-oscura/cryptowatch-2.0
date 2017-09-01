import React, { Component } from 'react';
import { allCurrencies } from './utils/currencies.js';
import axios from 'axios';
import io from 'socket.io-client';
import CCC from './utils/ccc-streamer-utilities.js';
import Currencies from './Currencies';
import CurrentQuote from './CurrentQuote';
import LineGraph from './LineGraph';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {},
      historical: {},
      recent: {},
      selectedCurrencies: {
        fromCur: ["BTC", "ETH"],
        toCur: ["USD"],
        display: [],
      },
      allCurrencies
    };
    this.updateSelectedCurrencies = this.updateSelectedCurrencies.bind(this);
  }

  bootstrapData(){
    let { selectedCurrencies } = this.state;
    let subscriptions = [];
    selectedCurrencies.fromCur.forEach((f_cur) => {
      selectedCurrencies.toCur.forEach((t_cur) => {
        this.fetchHistoricalData(f_cur, t_cur);
        subscriptions.push(`5~CCCAGG~${f_cur}~${t_cur}`);
      });
    });
    this.subscribeToCurrentQuotes(subscriptions);
    this.updateDisplayedCurrencyPairings();
  }

  updateDisplayedCurrencyPairings(){
    let { selectedCurrencies, allCurrencies } = this.state;
    selectedCurrencies.display = allCurrencies.pairingOrder.filter(item => {
      let divider = item.indexOf('-'),
          fromCur = item.slice(0,divider),
          toCur = item.slice(divider+1);
      return selectedCurrencies.fromCur.includes(fromCur) && selectedCurrencies.toCur.includes(toCur) ? item : null;
    });
    this.setState({ selectedCurrencies });
  }

  fetchHistoricalData(f_cur, t_cur){
    this.queryCryptoCompareHistoryData(`fsym=${f_cur}&tsym=${t_cur}`)
    .then(response => {
      if(response.status === 200){
        let { historical } = this.state;
        historical[`${f_cur}-${t_cur}`] = response.data.Data;
        this.setState({historical});
      }
    })
    .catch(error => {
      console.log('error for', f_cur, t_cur, error);
    });
  }

  subscribeToCurrentQuotes(subscriptions){
    // get current (current quotes object) in state
    let { current } = this.state;

    // instantiate socket
    const socket = io.connect('https://streamer.cryptocompare.com/');

    // subscribe to current quotes
    socket.emit('SubAdd', {subs:subscriptions} );

    // listen to socket & update state
    socket.on("m", (message) => {
      let messageType = message.slice(0, message.indexOf("~"));
      let res = {};
      if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);

        // check if response has all needed fields
        if(res.LASTUPDATE && res.PRICE && res.FROMSYMBOL && res.TOSYMBOL){

          // only update state.current if there is a change in price (or if this is first current data received)
          if (current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] === undefined || (current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`].PRICE !== res.PRICE)){
            current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] = res;
            this.setState({ current });
          }
        }
      }
    });
  }

  unsubscribeToCurrentQuotes(subscriptions){
    // instantiate socket
    const socket = io.connect('https://streamer.cryptocompare.com/');
    // unsubscribe to current quotes
    socket.emit('SubRemove', {subs:subscriptions} );
  }

  updateSelectedCurrencies(clickedCurrency, fromOrTo){
    let selectedCurrencies = this.state.selectedCurrencies;
    let subscriptions = [];
    if (selectedCurrencies[fromOrTo].includes(clickedCurrency)) {
      if(fromOrTo==="fromCur"){
        selectedCurrencies.toCur.forEach(t_cur => {
          subscriptions.push(`5~CCCAGG~${clickedCurrency}~${t_cur}`);
        });
      } else {
        selectedCurrencies.fromCur.forEach(f_cur => {
          subscriptions.push(`5~CCCAGG~${f_cur}~${clickedCurrency}`);
        });
      }
      this.unsubscribeToCurrentQuotes(subscriptions);
      selectedCurrencies[fromOrTo] = selectedCurrencies[fromOrTo].filter(item => {
        return item !== clickedCurrency ? item : null;
      });
      selectedCurrencies.display = selectedCurrencies.display.filter((item) => {
        return item.includes(clickedCurrency) ? null : item;
      });
      this.setState({selectedCurrencies});
    } else {
      selectedCurrencies[fromOrTo].push(clickedCurrency);
      if(fromOrTo==="fromCur"){
        selectedCurrencies.toCur.forEach(t_cur => {
          this.fetchHistoricalData(clickedCurrency, t_cur);
          subscriptions.push(`5~CCCAGG~${clickedCurrency}~${t_cur}`);
        });
      } else {
        selectedCurrencies.fromCur.forEach(f_cur => {
          this.fetchHistoricalData(f_cur, clickedCurrency);
          subscriptions.push(`5~CCCAGG~${f_cur}~${clickedCurrency}`);
        });
      }
      selectedCurrencies.display = selectedCurrencies.display.filter((item) => {
        return item.includes(clickedCurrency) ? null : item;
      });
      this.setState({selectedCurrencies});
      this.subscribeToCurrentQuotes(subscriptions);
      this.updateDisplayedCurrencyPairings();
    }
  }

  queryCryptoCompareHistoryData(currencyPair){
    const apiCall = `https://min-api.cryptocompare.com/data/histoday?${currencyPair}&limit=60&aggregate=3&e=CCCAGG`;
    return axios.get(apiCall)
      .then(response => response )
      .catch(error => { throw error });
  }

  componentWillMount(){
    this.bootstrapData();
  }

  render() {
    let {current, historical, selectedCurrencies} = this.state;
    let historicalKeys = Object.keys(historical),
        historicalCloseData = {};
    historicalKeys.forEach(currencyPair => {
      historicalCloseData[`${currencyPair}`] = historical[`${currencyPair}`].map(point => ([point.time, point.close]))
    });

    return (
      <div className="App">
        <div className="wrapper">

          <div className="App-header">
            <h2>CryptoGlance</h2>
          </div>

          <div className="App-body">
            
            <Currencies 
              selectedFromCurrencies={selectedCurrencies.fromCur}
              selectedToCurrencies={selectedCurrencies.toCur}
              updateSelectedCurrencies={this.updateSelectedCurrencies}
            />
            {
              selectedCurrencies.display.map((currencyPair, i) => (
                <div className="full">
                  <div className="m-half s-full">
                    {
                      current[currencyPair] && <CurrentQuote
                        key={i}
                        current={current[currencyPair]}
                        yesterday={historical[currencyPair]}
                      />
                    }
                  </div>

                  <div className="m-half s-full LineGraphs">
                    {
                      historical[currencyPair] && <LineGraph
                        key={i}
                        currencyPair={currencyPair}
                        data={historicalCloseData[currencyPair]}
                      />
                  }
                  </div>
                </div>
              ))
            }
          </div>{/* end of App-body */}

        </div>{/* end of wrapper */}
      </div>
    );
  }
}

export default App;
