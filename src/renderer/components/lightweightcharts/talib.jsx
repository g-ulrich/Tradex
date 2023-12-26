/*
https://github.com/anandanand84/technicalindicators
*/

// Import Statements
import {convertJSONArrayToJSON} from '../util';
import {
  ADL, ADX, ATR, AverageGain, AverageLoss, AwesomeOscillator, BollingerBands, CCI, CandleData, CandleList, ChandelierExit, ChandelierExitInput, ChandelierExitOutput, CrossDown, CrossUp, EMA, FixedSizeLinkedList, ForceIndex, HeikinAshi, Highest, IchimokuCloud, KST, KeltnerChannels, KeltnerChannelsInput, KeltnerChannelsOutput, Lowest, MACD, MFI, OBV, PSAR, ROC, RSI, SD, SMA, Stochastic, StochasticRSI, Sum, TRIX, TrueRange, VWAP, VolumeProfile, WEMA, WMA, WilliamsR, abandonedbaby, adl, adx, atr, averagegain, averageloss, awesomeoscillator, bearish, bearishengulfingpattern, bearishhammerstick, bearishharami, bearishharamicross, bearishinvertedhammerstick, bearishmarubozu, bearishspinningtop, bollingerbands, bullish, bullishengulfingpattern, bullishhammerstick, bullishharami, bullishharamicross, bullishinvertedhammerstick, bullishmarubozu, bullishspinningtop, cci, chandelierexit, crossDown, crossUp, darkcloudcover, doji, downsidetasukigap, dragonflydoji, ema, eveningdojistar, eveningstar, fibonacciretracement, forceindex, getConfig, gravestonedoji, hammerpattern, hammerpatternunconfirmed, hangingman, hangingmanunconfirmed, heikinashi, highest, ichimokucloud, keltnerchannels, kst, lowest, macd, mfi, morningdojistar, morningstar, obv, piercingline, psar, renko, roc, rsi, sd, setConfig, shootingstar, shootingstarunconfirmed, sma, stochastic, stochasticrsi, sum, threeblackcrows, threewhitesoldiers, trix, truerange, tweezerbottom, tweezertop, volumeprofile, vwap, wema, williamsr, wma
} from 'technicalindicators';

// import {
//   averageGain,
//   averageLoss,
//   crossUp,
//   crossDown,
//   crossOver,
//   highest,
//   lowest,
//   standardDeviation,
//   sum,
// } from 'technicalindicators/utils';

// import {
//   Renko,
//   HeikinAshi,
// } from 'technicalindicators/chart_types';

// import {
//   AbandonedBaby,
//   BearishEngulfingPattern,
//   BullishEngulfingPattern,
//   DarkCloudCover,
//   DownsideTasukiGap,
//   Doji,
//   DragonFlyDoji,
//   GraveStoneDoji,
//   BullishHarami,
//   BearishHaramiCross,
//   BullishHaramiCross,
//   BullishMarubozu,
//   BearishMarubozu,
//   EveningDojiStar,
//   EveningStar,
//   BearishHarami,
//   PiercingLine,
//   BullishSpinningTop,
//   BearishSpinningTop,
//   MorningDojiStar,
//   MorningStar,
//   ThreeBlackCrows,
//   ThreeWhiteSoldiers,
//   BullishHammer,
//   BearishHammer,
//   BullishInvertedHammer,
//   BearishInvertedHammer,
//   HammerPattern,
//   HammerPatternUnconfirmed,
//   HangingMan,
//   HangingManUnconfirmed,
//   ShootingStar,
//   ShootingStarUnconfirmed,
//   TweezerTop,
//   TweezerBottom,
// } from 'technicalindicators/candlestick_patterns';


export const transformIncomeData = (obj) => {
  if (typeof obj.length === 'number') {
    return convertJSONArrayToJSON(obj);
  } else {
    return obj;
  }
}

// Accumulation Distribution Line (ADL)
export const getADL = (obj) => {
  var data = transformIncomeData(obj);
  return ADL.calculate({ close: data.close, volume: data.volume });
}; // Accumulation Distribution Line (ADL)

// Average Directional Index (ADX)
export const getADX = (obj, n=14) => {
  var data = transformIncomeData(obj);
  return ADX.calculate({ close: data.close, period: n });
} // Average Directional Index (ADX)

// Average True Range (ATR)
export const getATR = (obj, n) => {
  var data = transformIncomeData(obj);
  return ATR.calculate({ high: data.high, low: data.low, close: data.close, period: n });
} // Average True Range (ATR)

// Awesome Oscillator (AO)
export const getAO = (obj) => {
  var data = transformIncomeData(obj);
  return AO.calculate({ high: data.high, low: data.low });
} // Awesome Oscillator (AO)

// Bollinger Bands (BB)
export const getBB = (obj, n, k) => {
  var data = transformIncomeData(obj);
  return BB.calculate({ values: data.close, period: n, stdDev: k });
} // Bollinger Bands (BB)

// Commodity Channel Index (CCI)
export const getCCI = (obj, n) => {
  var data = transformIncomeData(obj);
  return CCI.calculate({ high: data.high, low: data.low, close: data.close, period: n });
} // Commodity Channel Index (CCI)

// Force Index (FI)
export const getForceIndex = (obj, n) => {
  var data = transformIncomeData(obj);
  return ForceIndex.calculate({ close: data.close, volume: data.volume, period: n });
} // Force Index (FI)

// Know Sure Thing (KST)
export const getKST = (obj, r, s, t, w1, w2, w3, w4) => {
  var data = transformIncomeData(obj);
  return KST.calculate({ close: data.close, rocPer1: r, rocPer2: s, rocPer3: t, rocPer4: w1, smaPer1: w2, smaPer2: w3, smaPer3: w4 });
} // Know Sure Thing (KST)

// Moneyflow Index (MFI)
export const getMFI = (obj, n) => {
  var data = transformIncomeData(obj);
  return MFI.calculate({ high: data.high, low: data.low, close: data.close, volume: data.volume, period: n });
} // Moneyflow Index (MFI)

// On Balance Volume (OBV)
export const getOBV = (obj) => {
  var data = transformIncomeData(obj);
  return OBV.calculate({ close: data.close, volume: data.volume });
} // On Balance Volume (OBV)

// Parabolic Stop and Reverse (PSAR)
export const getPSAR = (obj, step, max) => {
  var data = transformIncomeData(obj);
  return PSAR.calculate({ high: data.high, low: data.low, step, max });
} // Parabolic Stop and Reverse (PSAR)

// Rate of Change (ROC)
export const getROC = (obj, n) => {
  var data = transformIncomeData(obj);
  return ROC.calculate({ values: data.close, period: n });
} // Rate of Change (ROC)

// Simple Moving Average (SMA)
export const getSMA = (obj, n) => {
  var data = transformIncomeData(obj);
  return SMA.calculate({ values: data.close, period: n });
} // Simple Moving Average (SMA)

// Stochastic Oscillator (KD)
export const getStochastic = (obj, k, d) => {
  var data = transformIncomeData(obj);
  return Stochastic.calculate({ high: data.high, low: data.low, close: data.close, period: k, signalPeriod: d });
} // Stochastic Oscillator (KD)

// Stochastic RSI (StochRSI)
export const getStochRSI = (obj, n, k, d) => {
  var data = transformIncomeData(obj);
  return StochasticRSI.calculate({ values: data.close, period: n, k, d });
} // Stochastic RSI (StochRSI)

// Triple Exponentially Smoothed Average (TRIX)
export const getTRIX = (obj, n) => {
  var data = transformIncomeData(obj);
  return TRIX.calculate({ values: data.close, period: n });
} // Triple Exponentially Smoothed Average (TRIX)

// Typical Price
export const getTypicalPrice = (obj) => {
  var data = transformIncomeData(obj);
  return TypicalPrice.calculate({ high: data.high, low: data.low, close: data.close });
} // Typical Price

// Volume Weighted Average Price (VWAP)
export const getVWAP = (obj) => {
  var data = transformIncomeData(obj);
  return VWAP.calculate({ high: data.high, low: data.low, close: data.close, volume: data.volume });
} // Volume Weighted Average Price (VWAP)

// Volume Profile (VP)
export const getVP = (obj) => {
  var data = transformIncomeData(obj);
  return VP.calculate({ open: data.open, high: data.high, low: data.low, close: data.close, volume: data.volume });
} // Volume Profile (VP)

// Exponential Moving Average (EMA)
export const getEMA = (obj, n) => {
  var data = transformIncomeData(obj);
  return EMA.calculate({ values: data.close, period: n });
} // Exponential Moving Average (EMA)

// Weighted Moving Average (WMA)
export const getWMA = (obj, n) => {
  var data = transformIncomeData(obj);
  return WMA.calculate({ values: data.close, period: n });
} // Weighted Moving Average (WMA)

// Smoothed Moving Average (SMMA)
export const getSmoothedMA = (obj, n) => {
  var data = transformIncomeData(obj);
  return SmoothedMA.calculate({ values: data.close, period: n });
} // Smoothed Moving Average (SMMA)
