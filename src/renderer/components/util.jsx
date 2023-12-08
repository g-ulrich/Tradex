import React, {} from 'react';

export const getHeightFromClass = (classStr) => {
    const ele = document.getElementsByClassName(classStr)[0];
    return ele.offsetHeight;
}

export const currentESTDatetime = () => {
  // '12/06/2023, 11:39:12 AM'
  const dt = new Date();
  return dt.toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'EST'});
}

export const formatCurrency = (amount) => {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export const generateRandomData = (count) => {
  const symbols = ["AAPL", "GOOGL", "AMZN", "MSFT", "TSLA", "FB", "NFLX", "NVDA", "V", "PYPL", "INTC", "AMD", "CSCO", "IBM", "ORCL", "QCOM", "GS", "JPM", "BA", "MMM", "DIS", "XOM", "CVX", "PFE", "WMT", "KO", "PEP", "HD", "CAT", "MRK", "VZ", "AAP", "BA", "C", "DOW", "GS", "IBM", "JNJ", "MCD", "NKE", "PG", "TRV", "UNH", "VZ", "WBA", "WMT", "XOM"];  const randomData = [];

  for (let i = 0; i < count; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const randomObject = {
      Symbol: symbol,
      Open: (Math.random() * 200 + 100).toFixed(2),
      PreviousClose: (Math.random() * 200 + 100).toFixed(2),
      Last: (Math.random() * 200 + 100).toFixed(2),
      Ask: (Math.random() * 200 + 100).toFixed(2),
      AskSize: Math.floor(Math.random() * 500) + 100,
      Bid: (Math.random() * 200 + 100).toFixed(2),
      BidSize: Math.floor(Math.random() * 500) + 100,
      NetChange: ((Math.random() - 0.5) * 10).toFixed(2),
      NetChangePct: ((Math.random() - 0.5) * 2).toFixed(3),
      High52Week: (Math.random() * 100 + 200).toFixed(2),
      High52WeekTimestamp: "2022-01-10T00:00:00Z", // Replace with actual date logic if needed
      Low52Week: (Math.random() * 100).toFixed(2),
      Low52WeekTimestamp: "2022-06-20T00:00:00Z", // Replace with actual date logic if needed
      Volume: Math.floor(Math.random() * 10000000) + 1000000,
      PreviousVolume: Math.floor(Math.random() * 30000000) + 10000000,
      Close: (Math.random() * 200 + 100).toFixed(2),
      DailyOpenInterest: Math.floor(Math.random() * 1000),
      TradeTime: new Date().toISOString(), // Current timestamp
      TickSizeTier: Math.floor(Math.random() * 3), // Assuming 0, 1, 2 as possible values
      MarketFlags: {
        IsDelayed: false,
        IsHardToBorrow: Math.random() < 0.2, // 20% chance of being true
        IsBats: Math.random() < 0.3, // 30% chance of being true
        IsHalted: Math.random() < 0.1, // 10% chance of being true
      },
    };

    randomData.push(randomObject);
  }

  return randomData;
}

export const strHas = (str, substr) => {
  return str.indexOf(substr) !== -1;
}
