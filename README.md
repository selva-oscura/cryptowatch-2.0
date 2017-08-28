# cryptowatch-2.0

Inspired by the [cryptowat.ch](https://cryptowat.ch/) website, this hack night project was an excuse to play with React.js, APIs, web sockets, RX.js, and D3.js.  Project members included [Carol St. Louis](https://github.com/selva-oscura), [Neil](https://github.com/iccir919), and Swizec Teller ([website](https://swizec.com/), [github](https://github.com/Swizec)) who was an awesome mentor!

The project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Using data from [CryptoCompare](https://www.cryptocompare.com), the app uses [axios](https://www.npmjs.com/package/axios) for api calls to fetch historical data and [socket.io-client](https://www.npmjs.com/package/socket.io-client) for web sockets to subscribe to current price quotes.

Graphs were implemented with [D3.js](https://d3js.org/).

To run locally (directions assume that you have already installed node (v.6+), npm or yarn, and git):
* download or clone project (in terminal, type <code>git clone https://github.com/selva-oscura/cryptowatch-2.0.git</code>),
* switch to project directory (in terminal, type <code>cd cryptowatch-2.0</code>),
* install dependencies (in terminal, type <code>yarn install</code> or <code>npm install</code>),
* run project (in terminal, type <code>yarn start</code> or <code>npm start</code>),
* view in browser at localhost:3000
