import {isSubStr, renameKey, jsonArrayToArrayByKey} from '../util';

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
      if (isSubStr(values[j], "/")) {
        convertedValue = Date.parse(values[j]) / 1000;
      } else if (!isNaN(parseFloat(values[j].replace(/"/g, "")))) {

        convertedValue = parseFloat(values[j].replace(/"/g, ""));
      } else {
        convertedValue = values[j];
      }

      jsonObject[headers[j]] =  convertedValue;
    }

    jsonArray.push(jsonObject);
  }

  return renameKey(jsonArray, "date", "time").reverse();
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


export const getVisRange = (candles, primaryChartRef) => {
  if (primaryChartRef.current !== null) {
    const chartRange = primaryChartRef.current.timeScale().getVisibleRange();
    const fromIndex = candles.findIndex(
      (item) => item["time"] === chartRange.from
    );
    const toIndex = candles.findIndex(
      (item) => item["time"] === chartRange.to
    );
    return { from: fromIndex, to: toIndex };
  }
  return { from: 0, to: 1 };
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
