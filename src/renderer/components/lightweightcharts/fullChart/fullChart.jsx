import React, { useEffect, useState, useRef } from "react";
import * as talib from "../talib";
import ChartLegend from './legend';
import { data as OHLCV } from "../exampleData";
import { ColorType, CrosshairMode } from "lightweight-charts";
import {
  Chart,
  LineSeries,
  BarSeries,
  PriceLine,
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  PriceScale,
  TimeScale,
} from "lightweight-charts-react-wrapper";
import {
  defaultChartOptions,
  chartColors,
  seriesColors,
  CHART_THEMES,
} from "../options";
import {
  convertArrayToJsonArrayForChart,
  indicatorToLineChart,
  bollingerbandsToLineSeriesJsonArr,
  ichimokucToAreaLineJsonArr,
  csvToJsonArray,
  candleToLineChart,
  formatVolume,
  getVisRange,
  filterJsonArrayByTimestamp,
  getTimestampNMinsAgo,
  getUtcTimestampNMinutesBack,
} from "../util";
import { isStringInArray, isSubStr, getAllFunctions, getRandomRGB, findObjectById } from "../../util";
import {
  IconFlask,
  IconFlaskVial,
  IconCandleChart,
  IconBarChart,
  IconAreaChart,
  IconLineChart,
  IconSearch,
  IconWallet,
} from "../../Icons";
import {StudiesList} from "../studies";
import AreaChartType from './areaChartType';
import InsertChartStudies from './insertChartStudies';
import InsertVolume from './insertVolume';
import InsertCandles from './insertCandles';
import InsertChartHeader from './insertChartHeader';

export default function FullChart({ dataCallBack }) {
  const containerRef = useRef(null);
  const primaryChartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [candles, setCandles] = useState(null);
  const [showStudy, setShowStudy] = useState(false);
  const [crosshairIndex, setCrosshairIndex] = useState(0);
  const [chartStudies, setChartStudies] = useState([]);
  const [chartType, setChartType] = useState("area"); // bar, candle, line, area


  const getInitialCandles = (daysBack=5) => {
    const jsonArr = dataCallBack();
    if (jsonArr.length > 0) {
      const timeBack = getUtcTimestampNMinutesBack(60*(daysBack*24), parseInt(jsonArr[jsonArr.length-1].time));
      setCandles(filterJsonArrayByTimestamp(jsonArr, timeBack));
    }
  }

  useEffect(() => {
    getInitialCandles();

    const resizeWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth);
      }
    };
    resizeWidth();
    window.addEventListener("resize", resizeWidth);
    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
  }, []);

  const addStudyCallback = (obj, RGBcolor, inputValues) => {
    obj.id = `${obj.name}_${chartStudies.length}`;
    obj.color = RGBcolor; // update color from the rgbcolor val
    obj.variables = obj.parameters
    .filter((p) => p.var !== "obj")
    .map((p) =>{
    var n = document.getElementById(`${obj.name}_${p.var}`).value;
    return isSubStr(n, '.') ? parseFloat(n) : parseInt(n);}
    );
    obj.hidden = false;
    if (isSubStr(obj.name, 'getBollingerBands')) {
      obj.data = bollingerbandsToLineSeriesJsonArr(candles,
        talib[obj.name](candles, ...obj.variables));
    } else if (isSubStr(obj.name, 'getIchimokucloud')) {
      obj.data = ichimokucToAreaLineJsonArr(candles,
        talib[obj.name](candles, ...obj.variables));
    } else {
      obj.data = indicatorToLineChart(
        candles,
        talib[obj.name](candles, ...obj.variables)
      );
    }
    setChartStudies((prevChartStudies) => [...prevChartStudies, obj]);
  };

  const toggleStudies = () => {
    setShowStudy(!showStudy);
  };

  const crosshairAction = (e) => {
    if (primaryChartRef.current) {
      // const range = getVisRange(candles, primaryChartRef);
      const currentIndex = candles.findIndex(obj => obj.time === e.time || obj.time === candles[candles.length-1].time);
      setCrosshairIndex(currentIndex);
    }

  };

  const studyCallbackFunc = (action, studyObj) => {
    if (action === 'vis') {
      const updatedStudies = chartStudies.map(study => {
        if (study.id === studyObj.id) {
          return { ...study, hidden: !study.hidden };
        }
        return study;
      });
      setChartStudies(updatedStudies);
    } else if (action === 'del') {
      const updatedStudies = chartStudies.filter(study => study.id !== studyObj.id);
      setChartStudies(updatedStudies);
    } else if (action === 'set') {
      // TODO make settings popup
    }
  }

  const chartTypeCallback = (txt)=>{
    setChartType(txt);
  }


  return (
    <>
      <div ref={containerRef} className="grow relative min-w-[300px] sm:w-[100%]">
        <div className="w-full h-[610px] bg-discord-darkestGray rounded py-2">
        <StudiesList
            showStudy={showStudy}
            addStudyCallback={addStudyCallback}
            toggleStudies={toggleStudies}
          />
        {candles && containerRef.current ? (
          <>
            <InsertChartHeader
            toggleStudiesFunc={toggleStudies}
            chartTypeCallback={chartTypeCallback}
            chartType={chartType} showStudy={showStudy}/>

            <ChartLegend candles={candles}
                  moveindex={crosshairIndex}
                  chartref={primaryChartRef}
                  studies={chartStudies}
                  studycallback={studyCallbackFunc}/>

            <Chart
              ref={primaryChartRef}
              onCrosshairMove={crosshairAction}
              {...defaultChartOptions({ width: chartWidth, height: 600 })}>

              <InsertVolume candles={candles}/>
              <InsertCandles candles={candles} chartType={chartType} candleKey={'close'} visRange={getVisRange(candles, primaryChartRef)}/>
              <InsertChartStudies selectedStudies={chartStudies}/>
            </Chart>
            </>
          ) : (
            <span className="text-center">Loading...</span>
          )}
        </div>
      </div>
    </>
  );
}
