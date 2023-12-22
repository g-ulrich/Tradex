import {isSubStr, renameKey, jsonArrayToArrayByKey} from '../util';


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
