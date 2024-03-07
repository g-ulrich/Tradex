import {isSubStr, renameKey, jsonArrayToArrayByKey} from '../../tools/util';
import * as talib from './talib';

export const bollingerbandsToLineSeriesJsonArr = (stockJsonArray, bollingerJsonArray) => {
  const timestamp = jsonArrayToArrayByKey(stockJsonArray, 'time').reverse();
  const oldBollingerData = bollingerJsonArray.reverse();
  const newBollingerData = [];
  oldBollingerData.forEach((obj, i) => {
    newBollingerData.push({
      time: timestamp[i],
      upper: obj.upper,
      middle: obj.middle,
      lower: obj.lower,
    });
  });
  return newBollingerData.reverse();
}

export const ichimokucToAreaLineJsonArr = (stockJsonArray, indJsonArray) => {
  const timestamp = jsonArrayToArrayByKey(stockJsonArray, 'time').reverse();
  const oldData = indJsonArray.reverse();
  const newData = [];
  oldData.forEach((obj, i) => {
    newData.push({
      time: timestamp[i],
      conversion: obj.conversion,
      base: obj.base,
      spanA: obj.spanA,
      spanB: obj.spanB,
    });
  });
  return newData.reverse();
}

export const candleToLineChart = (candleJsonArray, candleKeyName="close") => {
  const timestampArray = jsonArrayToArrayByKey(candleJsonArray, 'time');
  const valuesArray = jsonArrayToArrayByKey(candleJsonArray, candleKeyName);
  const newJsonArray = convertArrayToJsonArrayForChart(valuesArray, timestampArray);
  return newJsonArray;
}

export const indicatorToLineChart = (stockJsonArray, indicatorValuesArray) => {
  const timestamp = jsonArrayToArrayByKey(stockJsonArray, 'time');
  const indicatorJson = convertArrayToJsonArrayForChart(indicatorValuesArray, timestamp);
  return indicatorJson;
}

export const convertArrayToJsonArrayForChart = (indicatorArr, timestampArr) => {
  const timestamps = timestampArr.reverse();
  const indicatorVals = indicatorArr.reverse();
  const jsonArray = [];
  indicatorVals.forEach((val, i) => {
    jsonArray.push({ time: timestamps[i], value: val });
  });
  return jsonArray.reverse();
}


export const csvToJsonArray = (csvString) => {
  const rows = csvString.split("\n");
  const headers = rows[0].replace(/"/g, "").split(",");
  const jsonArray = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(",");
    const jsonObject = {};

    for (let j = 0; j < headers.length; j++) {
      let convertedValue;
      // if (typeof values[j] === 'string'   ) {
        if (headers[j] === 'time') {
          const dateSeconds = new Date(parseInt(values[j]) )
          convertedValue = parseInt(values[j]); //dateSeconds.getTime();
        } else if (headers[j] !== 'volume') {
          convertedValue = parseFloat(values[j]);
        } else if (headers[j] === 'volume'){
          convertedValue = parseInt(values[j]);
        } else {
          convertedValue = values[j];
        }
      // }else {

        // if (headers[j] === 'time') {
        //   console.log(headers[j], values[j]);
        //   const dateSeconds = new Date(timestampSeconds * 1000)
        //   // const date = new Date(values[j] * 1000); // Convert to milliseconds
        //   // convertedValue = date.getTime() / 1000; // UTC timeststamp
        //   convertedValue = dateSeconds.toISOString().split('T')[0];
        // } else {
        //   convertedValue = values[j];
        // }
      //   convertedValue = values[j];

      // }

      if (headers[j] !== 'Volume MA'){
        jsonObject[headers[j]] =  convertedValue;
      }

    }

    jsonArray.push(jsonObject);
  }

  return jsonArray.sort((a, b) => a.time - b.time);// renameKey(jsonArray, "date", "time").reverse();
}


export const convertJsonArrayToArrayByKey = (jsonArray, key) => {
  return jsonArray.map(item => item[key]);
}


export const formatVolume = (number) => {
  const suffixes = ["", "K", "M", "B"];
  const suffixNum = Math.floor(("" + number).length / 3);
  let shortNumber = parseFloat((suffixNum !== 0 ? (number / Math.pow(1000, suffixNum)) : number).toPrecision(5));
  if (shortNumber % 1 !== 0) {
    shortNumber = shortNumber.toFixed(3);
  }
  return shortNumber + suffixes[suffixNum];
}


export const getVisRange = (candles, chartRef) => {
  if (chartRef.current) {
    const chartRange = chartRef.current.timeScale().getVisibleRange();
    if (chartRange){
      const fromIndex = candles.findIndex(
        (item) => item["time"] === chartRange.from
      );
      const toIndex = candles.findIndex(
        (item) => item["time"] === chartRange.to
      );
      return { from: fromIndex, to: toIndex};
    }
  }
  return { from: 0, to: 1 };
};


export const getVisRangeTimestamps = (candles, primaryChartRef) => {
  if (primaryChartRef.current !== null) {
    const chartRange = primaryChartRef.current.timeScale().getVisibleRange();
    const fromIndex = candles.findIndex(
      (item) => item["time"] === chartRange.from
    );
    const toIndex = candles.findIndex(
      (item) => item["time"] === chartRange.to
    );
    return { from: candles[fromIndex].time, to: candles[toIndex].time };
  }
  return { from: candles[0].time, to: candles[1].time };
};

export const getMarketOpenStatus = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();

  if (dayOfWeek === 0 || dayOfWeek === 6 || hour >= 20 || hour < 7 || (hour === 7 && minute < 30)) {
    return "Closed";
  } else if (hour >= 7 && hour < 9 || (hour === 9 && minute < 30)) {
    return "Pre";
  } else if (hour >= 9 && hour < 16) {
    return "Reg";
  } else if (hour >= 16 && hour < 20) {
    return "Post";
  }
}


export const filterJsonArrayByTimestamp = (candles, timestamp) => {
  return candles.filter(obj => obj.time >= timestamp);
}

export const getTimestampNMinsAgo = (n) => {
  var current = new Date();
  var nMinutesAgo = new Date(current.getTime() - n * 60000); // Convert minutes to milliseconds
  var linuxTimestamp = Math.floor(nMinutesAgo.getTime() / 1000); // Convert milliseconds to seconds
  return linuxTimestamp;
}

export const getUtcTimestampNMinutesBack = (n, currentTimestamp) => {
  var currentMillis = currentTimestamp * 1000; // Convert seconds to milliseconds
  var current = new Date(currentMillis);
  var nMinutesAgo = new Date(current.getTime() - n * 60000); // Convert minutes to milliseconds
  var utcTimestamp = Math.floor(nMinutesAgo.getTime() / 1000); // Convert milliseconds to seconds
  return utcTimestamp;
}


export const getWaterMark = (txt, size=60) => {
  return {
      visible: true,
      fontSize: size,
      horzAlign: 'center',
      vertAlign: 'center',
      color: 'rgba(255, 255, 255, 0.05)',
      text: txt,
  }
}


export const getFullSymbolName = (symbol, details) => {
  if (details) {
    return `${symbol}:${details[0]?.Exchange}`;
  }else{
    return `${symbol}`;
  }
}


export const crosshairAction = (setter, chartRef, candles, e) => {
  if (chartRef.current) {
    try {
      const currentIndex = candles.findIndex(obj => obj.time === e.time || obj.time === candles[candles.length-1].time);
      setter(currentIndex);
    } catch (error) {
      console.error(`Setting Crosshair Index - ${error}`);
    }
  }
};

export const addStudyCallback = (setter, candles, obj, RGBcolor, inputValues) => {
  obj.id = `${obj.name}_${parseInt(RGBcolor)}`;
  obj.color = RGBcolor; // update color from the rgbcolor val
  obj.variables = obj.parameters
  .filter((p) => p.var !== "obj")
  .map((p) =>{
  var n = document.getElementById(`${obj.name}_${p.var}`).value;
  return isSubStr(n, '.') ? parseFloat(n) : parseInt(n);}
  );
  obj.hidden = false;
  // if (isSubStr(obj.name, 'getBollingerBands')) {
  //   obj.data = bollingerbandsToLineSeriesJsonArr(candles,
  //     talib[obj.name](candles, ...obj.variables));
  // } else if (isSubStr(obj.name, 'getIchimokucloud')) {
  //   obj.data = ichimokucToAreaLineJsonArr(candles,
  //     talib[obj.name](candles, ...obj.variables));
  // } else {
    obj.data = indicatorToLineChart(
      candles,
      talib[obj.name](candles, ...obj.variables)
    );
  // }
  setter(prev => [...prev, obj]);
};
