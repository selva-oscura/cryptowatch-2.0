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
        displayCurrent: [],
        displayHistorical: [],
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
  }

  fetchHistoricalData(f_cur, t_cur){
    this.queryCryptoCompareHistoryData(`fsym=${f_cur}&tsym=${t_cur}`)
    .then(response => {
      if(response.status === 200){
        let { selectedCurrencies, historical, allCurrencies } = this.state;
        historical[`${f_cur}-${t_cur}`] = response.data.Data;
        selectedCurrencies.displayHistorical = allCurrencies.pairingOrder.filter((item) => {
          let divider = item.indexOf('-'),
              fromCur = item.slice(0,divider),
              toCur = item.slice(divider+1);
          if (selectedCurrencies.fromCur.includes(fromCur)
            && selectedCurrencies.toCur.includes(toCur)
            && historical[`${item}`] !== undefined) {
            return item;
          } else {
            return null
          };
        });
        this.setState({historical, selectedCurrencies});
      }
    })
    .catch(error => {
      console.log('error for', f_cur, t_cur, error);
    });
  }

  subscribeToCurrentQuotes(subscriptions){
    // get current (current quotes object) in state
    let { current, selectedCurrencies } = this.state;

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

          // add currencyPair to selectedCurrencies.displayCurrent if this is the first time that current data has been received
          if (current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] === undefined || !selectedCurrencies.displayCurrent.includes(`${res.FROMSYMBOL}-${res.TOSYMBOL}`)) {
            selectedCurrencies.displayCurrent = allCurrencies.pairingOrder.filter((item) => {
              let divider = item.indexOf('-'),
                  fromCur = item.slice(0,divider),
                  toCur = item.slice(divider+1);
              if (selectedCurrencies.fromCur.includes(fromCur)
                && selectedCurrencies.toCur.includes(toCur)
                && (item === `${res.FROMSYMBOL}-${res.TOSYMBOL}`
                  || current[item] !== undefined)) {
                return item;
              }
            });
            this.setState({ selectedCurrencies });
          } 
        }
      }
    });
  }

  unsubscribeToCurrentQuotes(subscriptions){
    // get current (current quotes object), selectedCurrencies, and allCurrencies in state
    let { current, selectedCurrencies, allCurrencies } = this.state;

    // instantiate socket
    const socket = io.connect('https://streamer.cryptocompare.com/');

    // unsubscribe to current quotes
    socket.emit('SubRemove', {subs:subscriptions} );
    selectedCurrencies.displayCurrent = allCurrencies.pairingOrder.filter((item) => {
      let divider = item.indexOf('-'),
          fromCur = item.slice(0,divider),
          toCur = item.slice(divider+1);
      if (selectedCurrencies.fromCur.includes(fromCur)
        && selectedCurrencies.toCur.includes(toCur)) {
        return item;
      }
    });
    this.setState({current});
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
      selectedCurrencies.displayHistorical = selectedCurrencies.displayHistorical.filter((item) => {
        return item.includes(clickedCurrency) ? null : item;
      });
      selectedCurrencies.displayCurrent = selectedCurrencies.displayCurrent.filter((item) => {
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
      this.setState({selectedCurrencies});
      this.subscribeToCurrentQuotes(subscriptions);
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
            <h2>CryptoCurrency Quotes</h2>
          </div>

          <div className="App-body">
            
            <Currencies 
              selectedFromCurrencies={selectedCurrencies.fromCur}
              selectedToCurrencies={selectedCurrencies.toCur}
              updateSelectedCurrencies={this.updateSelectedCurrencies}
            />

            <div className="m-half s-all">
              {
                selectedCurrencies.displayCurrent.map((currencyPair, i) => (
                  <CurrentQuote
                    key={i}
                    current={current[currencyPair]}
                    yesterday={historical[currencyPair]}
                  />
                ))
              }
            </div>

            <div className="m-half s-all LineGraphs">
              {
                selectedCurrencies.displayHistorical.map((currencyPair, i) => (
                  <LineGraph
                    key={i}
                    currencyPair={currencyPair}
                    data={historicalCloseData[currencyPair]}
                  />
                ))
              }
            </div>
          </div>{/* end of App-body */}

        </div>{/* end of wrapper */}
      </div>
    );
  }
}

export default App;
