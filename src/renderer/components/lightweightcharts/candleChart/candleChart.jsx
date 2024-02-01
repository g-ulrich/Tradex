import React, { useEffect, useState, useRef } from "react";
import * as talib from "../talib";
// import ChartLegend from './legend';
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
import { isStringInArray, isSubStr, getAllFunctions, getRandomRGB, findObjectById } from "../../../tools/util";
import {
  IconFlask,
  IconFlaskVial,
  IconCandleChart,
  IconBarChart,
  IconAreaChart,
  IconLineChart,
  IconSearch,
  IconWallet,
} from "../../../api/Icons";
import AreaChartType from './areaChartType';
import InsertVolume from './insertVolume';
import InsertCandles from './insertCandles';

export default function CandleChart({ dataCallBack }) {
  const containerRef = useRef(null);
  const primaryChartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [candles, setCandles] = useState(null);
  const [showStudy, setShowStudy] = useState(false);
  const [crosshairIndex, setCrosshairIndex] = useState(0);
  const [chartStudies, setChartStudies] = useState([]);
  const [chartType, setChartType] = useState("bar"); // bar, candle, line, area


  const getInitialCandles = (daysBack=5) => {
    const jsonArr = dataCallBack();
    // if (jsonArr.length > 0) {
    //   const timeBack = getUtcTimestampNMinutesBack(60*(daysBack*24), parseInt(jsonArr[jsonArr.length-1].time));
    //   setCandles(filterJsonArrayByTimestamp(jsonArr, timeBack));
    // }
    setCandles(jsonArr);
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

  const crosshairAction = (e) => {
    if (primaryChartRef.current) {
      // const range = getVisRange(candles, primaryChartRef);
      const currentIndex = candles.findIndex(obj => obj.time === e.time || obj.time === candles[candles.length-1].time);
      setCrosshairIndex(currentIndex);
    }
  };

  return (
    <>
      <div ref={containerRef} className="grow relative min-w-[300px] sm:w-[100%]">
        <div className="w-full h-[610px] bg-discord-darkestGray rounded py-2">
        {candles && containerRef.current ? (
          <>
            {/* <ChartLegend candles={candles}
                  moveindex={crosshairIndex}
                  chartref={primaryChartRef}
                  studies={chartStudies}
                  studycallback={studyCallbackFunc}/> */}

            <Chart
              ref={primaryChartRef}
              onCrosshairMove={crosshairAction}
              {...defaultChartOptions({ width: chartWidth, height: 600 })}>

              <InsertVolume candles={candles}/>
              <InsertCandles candles={candles} chartType={chartType} candleKey={'close'} visRange={getVisRange(candles, primaryChartRef)}/>
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
