import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';
import CCC from './utils/ccc-streamer-utilities.js';

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
        if (res.PRICE) {
          Object.keys(res).forEach(detail => console.log(detail, JSON.stringify(res[detail])))
          current[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] = res;
          if (recent[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] === undefined) {
            recent[`${res.FROMSYMBOL}-${res.TOSYMBOL}`] = [];
          }
          recent[`${res.FROMSYMBOL}-${res.TOSYMBOL}`].push([res.LASTUPDATE, res.PRICE]);
        }
        this.setState({current, recent});
      }
    });
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
        </div>
      </div>
    );
  }
}

export default App;
