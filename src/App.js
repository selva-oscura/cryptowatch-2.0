import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import CCC from './utils/ccc-streamer-utilities.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {},
      recent: {},
    };
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
