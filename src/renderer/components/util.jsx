import React from 'react';


export const getHeightFromClass = (classStr) => {
    const ele = document.getElementsByClassName(classStr)[0];
    return ele.offsetHeight;
}

export const titleBarheight = () => {
  return getHeightFromClass("cet-titlebar");
}

export const findObjectByVal = (jsonArray, desiredValue, keyToCheck) => {
  for (let i = 0; i < jsonArray.length; i++) {
    if (jsonArray[i][keyToCheck] === desiredValue) {
      return jsonArray[i];
    }
  }
  return null; // Return null if no match is found
}

export const currentESTTime = () => {
  const dt = new Date();
  return dt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'EST',
  });
}

export const currentESTDatetime = () => {
  // '12/06/2023, 11:39:12 AM'
  const dt = new Date();
  return dt.toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'EST'});
}

export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}


export const formatCurrency = (amount) => {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export const randNum = (start, finish) => {
  const range = finish - start + 1;
  return Math.floor(Math.random() * range) + start;
}

export const generateRandomData = () => {
  const symbols = ["AAPL", "GOOGL", "AMZN", "MSFT", "TSLA", "FB", "NFLX", "NVDA", "V", "PYPL", "INTC", "AMD", "CSCO", "IBM", "ORCL", "QCOM", "GS", "JPM", "BA", "MMM", "DIS", "XOM", "CVX", "PFE", "WMT", "KO", "PEP", "HD", "CAT", "MRK", "VZ", "AAP", "BA", "C", "DOW", "GS", "IBM", "JNJ", "MCD", "NKE", "PG", "TRV", "UNH", "VZ", "WBA", "WMT", "XOM"];  const randomData = [];

  for (let i = 0; i < symbols.length; i++) {
    const randomObject = {
      Symbol: symbols[i],
      Open: randNum(1, 2),
      PreviousClose: randNum(1, 2),
      Last: randNum(1, 5),
      Ask: randNum(1, 2),
      AskSize: randNum(1, 2),
      Bid: randNum(1, 2),
      BidSize: randNum(1, 2),
      NetChange: randNum(1, 2),
      NetChangePct: randNum(-10, 10),
      High52Week: randNum(1, 2),
      High52WeekTimestamp: "2022-01-10T00:00:00Z", // Replace with actual date logic if needed
      Low52Week: randNum(1, 2),
      Low52WeekTimestamp: "2022-06-20T00:00:00Z", // Replace with actual date logic if needed
      Volume:  randNum(1, 2),
      PreviousVolume: randNum(1, 2),
      Close: randNum(1, 2),
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

export const isCurTimeDivisibleByMinsWithTolerance = (min, sec) => {
  const currentDate = new Date();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();

  if (currentSecond >= 30 && currentSecond <= 30+sec) {
    return currentMinute % min === 0;
  }

  return false;
}


export const generateAlphaNumString = (n) => {
  const alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
    randomString += alphanumericChars[randomIndex];
  }

  return randomString;
}

export const  YTDInDays = () => {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var beginningOfYear = new Date(currentYear, 0, 1);
  var differenceInMilliseconds = currentDate - beginningOfYear;
  var differenceInDays = Math.round(differenceInMilliseconds / (24 * 60 * 60 * 1000));
  return differenceInDays;
}

export const ESTToGMT = (timestamp) => {
  return (timestamp + 5 * 60 * 60 * 1000) / 1000;
}

export const GMTtoEST = (timestamp) => {
  return (timestamp - 5 * 60 * 60 * 1000) / 1000;
}


export const getIndexByVal = (jsonArr, key, val) => {
  let index = -1;

for (let i = 0; i < jsonArr.length; i++) {
  if (jsonArr[i][key] === val) {
    index = i;
    break;
  }
}
return index;
}
