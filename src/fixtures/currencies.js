export const currencyAbbreviations = {
  fromCurrencies: {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    LTC: 'Litecoin',
    BCH: 'Bitcoin Cash / BCC',
    DASH: 'Digital Cash',
    EOS: 'EOS',
    ETC: 'Ethereum Classic',
    LSK: 'Lisk',
    IOT: 'IOTA',
    XMR: 'Monero',
    NEO: 'NEO',
    OMG: 'OmiseGo',
    XRP: 'Ripple',
    ZEC: 'ZCASH',
  },
};

const fromCurrencies = [
    { BTC: 'Bitcoin' },
    { ETH: 'Ethereum' },
    { LTC: 'Litecoin' },
    { BCH: 'Bitcoin Cash / BCC' },
    { DASH: 'Digital Cash' },
    { EOS: 'EOS' },
    { ETC: 'Ethereum Classic' },
    { LSK: 'Lisk' },
    { IOT: 'IOTA' },
    { XMR: 'Monero' },
    { NEO: 'NEO' },
    { OMG: 'OmiseGo' },
    { XRP: 'Ripple' },
    { ZEC: 'ZCASH' },
  ],
  toCurrencies = [
    { USD: 'US Dollar' },
    { EUR: 'Euro' },
    { GBP: 'British Pound' },
    { CNY: 'Chinese Yuan' },
    { JPY: 'Japanese Yen' },
    { RUB: 'Russian Ruble' },
    { INR: 'Indian Rupee' },
    { BRL: 'Brazilian Real' },
  ],
  pairingOrder = [];

fromCurrencies.forEach(f_cur => {
  toCurrencies.forEach(t_cur => {
    let f_cur_abbr = Object.keys(f_cur),
      t_cur_abbr = Object.keys(t_cur);
    pairingOrder.push(`${f_cur_abbr[0]}-${t_cur_abbr[0]}`);
  });
});

export const allCurrencies = {
  fromCurrencies,
  toCurrencies,
  pairingOrder,
};
