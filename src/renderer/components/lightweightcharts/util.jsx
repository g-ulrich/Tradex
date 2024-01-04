import {isSubStr, renameKey, jsonArrayToArrayByKey} from '../util';

export const bollingerbandsToAreaSeriesJsonArr = (stockJsonArray, bollingerJsonArray) => {
  const timestamp = jsonArrayToArrayByKey(stockJsonArray, 'time').reverse();
  const oldBollingerData = bollingerJsonArray.reverse();
  const newBollingerData = [];
  oldBollingerData.forEach((obj, i) => {
    newBollingerData.push({
      time: timestamp[i],
      // value: {
        upper: obj.upper,
        middle: obj.middle,
        lower: obj.lower,
      // }
    });
  });
  return newBollingerData.reverse();
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
