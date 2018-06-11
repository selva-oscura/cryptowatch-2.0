# CryptoGlance 
### (jokingly referred to as cryptowatch-2.0 when the project was started....  perhaps cryptowatch-0.2 would have been more apropos)

Inspired by the [cryptowat.ch](https://cryptowat.ch/) website, this [Real World React](https://www.meetup.com/Real-World-React/) August 24, 2017 [Hack Night](https://www.meetup.com/Real-World-React/events/242620292/) project was an excuse to play with React.js, APIs, web sockets, and D3.js.  Project members included [Carol St. Louis](https://github.com/selva-oscura), [Neil Ricci](https://github.com/iccir919), and Swizec Teller ([website](https://swizec.com/), [github](https://github.com/Swizec)) who was an awesome mentor!

The project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Using data from [CryptoCompare](https://www.cryptocompare.com), the app uses [axios](https://www.npmjs.com/package/axios) for api calls to fetch historical data and [socket.io-client](https://www.npmjs.com/package/socket.io-client) for web sockets to subscribe to current price quotes.

Graphs of the historical data were implemented with [D3.js](https://d3js.org/).

<p>See it live at <a href="https://selva-oscura.github.io/cryptowatch-2.0">online</a> or clone it and run it yourself.</p>

![CryptoGlance](https://github.com/selva-oscura/cryptowatch-2.0/blob/master/cryptoglance_screenshot.png)

To run locally (directions assume that you have already installed node (v.6+), npm or yarn, and git):
* download or clone project (in terminal, type <code>git clone https://github.com/selva-oscura/cryptowatch-2.0.git</code>),
* switch to project directory (in terminal, type <code>cd cryptowatch-2.0</code>),
* install dependencies (in terminal, type <code>yarn install</code> or <code>npm install</code>),
* run project (in terminal, type <code>yarn start</code> or <code>npm start</code>),
* view in browser at localhost:3000
