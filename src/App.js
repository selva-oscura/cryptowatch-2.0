import React, { Component } from 'react';
import './App.css';
cryptoSocket = require("crypto-socket")

class App extends Component {
  componentWillMount(){
    cryptoSocket.start();
    cryptoSocket.start("bitfinex","ETHBTC");
    cryptoSocket.start("bitmex","ETHBTC");
    cryptoSocket.start("cex","ETHBTC");
    setInterval(() => {
        cryptoSocket.echoExchange()
    },1000);
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
