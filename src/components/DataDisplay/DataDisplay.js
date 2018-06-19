import React from 'react';
import CurrentQuote from './CurrentQuote';
import Historical from './Historical';

const DataDisplay = ({ selectedCurrencies, current, historical, symbols }) => {
  let historicalKeys = Object.keys(historical),
    historicalCloseData = {};
  historicalKeys.forEach(currencyPair => {
    historicalCloseData[`${currencyPair}`] = historical[`${currencyPair}`].map(
      point => [point.time, point.close]
    );
  });

  return (
    <div className="DataDisplay">
      {selectedCurrencies.display.map((currencyPair, i) => (
        <div className="full" key={selectedCurrencies.display[i]}>
          <div className="m-half s-full">
            {current[currencyPair] && (
              <CurrentQuote
                key={i}
                current={current[currencyPair]}
                yesterday={historical[currencyPair]}
                symbols={symbols}
              />
            )}
          </div>

          <div className="m-half s-full">
            {historical[currencyPair] && (
              <Historical
                key={i}
                currencyPair={currencyPair}
                data={historicalCloseData[currencyPair]}
                symbols={symbols}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataDisplay;
