import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import CCC from './utils/ccc-streamer-utilities.js';
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
      currencies:{
        fromCur: ["BTC", "ETH"],
        toCur: ["USD"]
      }
    };
    this.fetchHistoricalData();
  }

  fetchHistoricalData(){
    let currencies = this.state.currencies;
    let currencyConversions = [];
    currencies.fromCur.forEach((f_cur) => {
      currencies.toCur.forEach((t_cur) => {
        currencyConversions.push([f_cur, t_cur]);
      });
    });
    currencyConversions.forEach(currencyPair => {
      this.queryCryptoCompareHistoryData(`fsym=${currencyPair[0]}&tsym=${currencyPair[1]}`)
        .then(response => {
          if(response.status === 200){
            let historical = this.state.historical;
            historical[`${currencyPair[0]}-${currencyPair[1]}`] = response.data.Data;
            this.setState({historical});
          }
        })
        .catch(error => {
          console.log('error for', currencyPair[0], currencyPair[1], error);
        });
    });

  }

  queryCryptoCompareHistoryData(currencyPair){
    const apiCall = `https://min-api.cryptocompare.com/data/histoday?${currencyPair}&limit=60&aggregate=3&e=CCCAGG`;
    return axios.get(apiCall)
      .then(response => response )
      .catch(error => { throw error });
  }

  componentWillMount(){
    let current = this.state.current;
    let recent = this.state.recent;

    // instantiate socket
    const socket = io.connect('https://streamer.cryptocompare.com/');

    // subscribe to current quotes
    const subscriptions = ['5~CCCAGG~BTC~USD','5~CCCAGG~ETH~USD'];
    socket.emit('SubAdd', {subs:subscriptions} );

    // listen to socket & update state
    socket.on("m", (message) => {
      let messageType = message.substring(0, message.indexOf("~"));
      let res = {};
      if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);

        // update if provided data has all needed fields
        if(res.LASTUPDATE && res.PRICE && res.FROMSYMBOL && res.TOSYMBOL){

          // instantiate array for each currency pair in state.recent the first time data is received for that currency
          if (recent[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] === undefined) {
            recent[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] = [];
          }
          // only update state.current if there is a change in price (or if this is first current data received)
          if(this.state.recent[`${res.FROMSYMBOL}-${res.TOSYMBOL}`].length === 0 || res.PRICE !== this.state.current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`].PRICE){
              current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] = res;
          }
          // always add newest time & price data to state.recent
          recent[`${res.FROMSYMBOL}-${res.TOSYMBOL}`].push([res.LASTUPDATE, res.PRICE]);

          this.setState({current, recent});
        }
      }
    });
  }

  render() {
    let currentData = Object.keys(this.state.current);
    let recentData = Object.keys(this.state.recent);
    return (
      <div className="App">
        <div className="wrapper">

          <div className="App-header">
            <h2>CryptoCurrency Quotes</h2>
          </div>

          <div className="App-body">
            <div className="m-half s-all">
              {
                currentData.map((current, i) => (
                  <CurrentQuote
                    key={i}
                    current={this.state.current[current]}
                    yesterday={this.state.historical[current]}
                  />
                ))
              }
            </div>
            <div className="m-half s-all">
              {
                recentData.map((currencyPair, i) => (
                  <LineGraph
                    key={i}
                    data={this.state.recent[currencyPair]}
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
