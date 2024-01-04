/*
https://github.com/anandanand84/technicalindicators
*/

// Import Statements
import {convertJSONArrayToJSON} from '../util';
import {
  volumeprofile, bollingerbands, ema, sma, wema, wma, vwap, trix, williamsr, ichimokucloud
  // ADL, ADX, ATR, AverageGain, AverageLoss, AwesomeOscillator, BollingerBands, CCI, CandleData, CandleList, ChandelierExit, ChandelierExitInput, ChandelierExitOutput, CrossDown, CrossUp, EMA, FixedSizeLinkedList, ForceIndex, HeikinAshi, Highest, IchimokuCloud, KST, KeltnerChannels, KeltnerChannelsInput, KeltnerChannelsOutput, Lowest, MACD, MFI, OBV, PSAR, ROC, RSI, SD, SMA, Stochastic, StochasticRSI, Sum, TRIX, TrueRange, VWAP, VolumeProfile, WEMA, WMA, WilliamsR, abandonedbaby, adl, adx, atr, averagegain, averageloss, awesomeoscillator, bearish, bearishengulfingpattern, bearishhammerstick, bearishharami, bearishharamicross, bearishinvertedhammerstick, bearishmarubozu, bearishspinningtop, bollingerbands, bullish, bullishengulfingpattern, bullishhammerstick, bullishharami, bullishharamicross, bullishinvertedhammerstick, bullishmarubozu, bullishspinningtop, cci, chandelierexit, crossDown, crossUp, darkcloudcover, doji, downsidetasukigap, dragonflydoji, ema, eveningdojistar, eveningstar, fibonacciretracement, forceindex, getConfig, gravestonedoji, hammerpattern, hammerpatternunconfirmed, hangingman, hangingmanunconfirmed, heikinashi, highest, ichimokucloud, keltnerchannels, kst, lowest, macd, mfi, morningdojistar, morningstar, obv, piercingline, psar, renko, roc, rsi, sd, setConfig, shootingstar, shootingstarunconfirmed, sma, stochastic, stochasticrsi, sum, threeblackcrows, threewhitesoldiers, trix, truerange, tweezerbottom, tweezertop, volumeprofile, vwap, wema, williamsr, wma
} from 'technicalindicators';

export const mainChart = () => {
  return [
      'getEMA', 'getSMA','getIchimokuCloud', 'getWEMA', 'getWMA', 'getVWAP', 'getBollingerBands'
    ]
  };

    // Oscillators and Other Indicators for Separate Graph
  export const separateGraph = () => {
      return [
      'getAwesomeOscillator', 'getKST', 'getStochastic', 'getStochasticRSI', 'getRSI', 'getWilliamsR',
      'getForceIndex', 'getMACD', 'getTRIX', 'getATR', 'getBollingerBands',
      'getADL', 'getOBV', 'getVolumeProfile'
    ]
  }



export const transformIncomeData = (obj) => {
  if (typeof obj.length === 'number') {
    return convertJSONArrayToJSON(obj);
  } else {
    return obj;
  }
}


export const volumeProfile = (obj, n) => {
  const data = transformIncomeData(obj);
  let input = {
    high      : data.high,
    open       : data.open,
    low       : data.low,
    close     : data.close,
    volume    : data.volume,
    noOfBars  : n
  };
  return volumeprofile(input);
}

/* single array return for separate chart */
// Triple Exponentially Smoothed Average (TRIX).
// export const getTRIX = (obj, n=18) => {
//   const data = transformIncomeData(obj);
//   return trix({ values: data.close, period: n});
// }

// // Williams % R oscillator
// export const getWilliamsR = (obj, n=14) => {
//   const data = transformIncomeData(obj);
//   let input = {
//     high: data.high,
//     low: data.low,
//     close: data.close,
//     period: n,
//   };
//   return williamsr(input);
// }

/*
single array return in chart
*/
// Exponential Moving Average (EMA)
export const getVWAP = (obj) => {
  const data = transformIncomeData(obj);
  return vwap({ high: data.high, low: data.low, close: data.close, volume: data.volume });
}

// Exponential Moving Average (EMA)
export const getEMA = (obj, n=5) => {
  const data = transformIncomeData(obj);
  return ema({ values: data.close, period: n});
}

// Simple Moving Average (SMA)
export const getSMA = (obj, n=5) => {
  const data = transformIncomeData(obj);
  return sma({ values: data.close, period: n});
}

// Weighted Exponential Moving Average (WEMA)
export const getWEMA = (obj, n=5) => {
  const data = transformIncomeData(obj);
  return wema({ values: data.close, period: n});
}

// Weighted Moving Average (WMA)
export const getWMA = (obj, n=5) => {
  const data = transformIncomeData(obj);
  return wma({ values: data.close, period: n});
}

/*
multiple array return for chart
*/

// bollinger bands
export const getBollingerBands = (obj, n=20, k=2) => {
  // {middle: 217.0, upper: 234.0, lower: 201.0, pb: 0.53}
  const data = transformIncomeData(obj);
  return bollingerbands({ values: data.close, period: 20, stdDev: 2 });
}

// Ichimokucloud
export const getIchimokucloud = (obj, con=9, base=26, span=52, displace=26) => {
  // {conversion: 229.245, base: 226.09, spanA: 227.0, spanB: 220.3}
  const data = transformIncomeData(obj);
  let input = {
    high  : data.high,
    low   :  data.low,
    conversionPeriod: con,
    basePeriod: base,
    spanPeriod: span,
    displacement: displace
  }
  return ichimokucloud(input);
}
