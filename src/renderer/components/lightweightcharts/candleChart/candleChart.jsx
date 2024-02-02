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
import axios from 'axios';

export default function CandleChart({ symbol, options }) {
  const marketData = window.ts.marketData;
  const containerRef = useRef(null);
  const seriesRef = useRef(null);
  const primaryChartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [candles, setCandles] = useState(null);
  const [newCandle, setNewCandle] = useState(null);
  const [showStudy, setShowStudy] = useState(false);
  const [crosshairIndex, setCrosshairIndex] = useState(0);
  const [chartStudies, setChartStudies] = useState([]);
  const [chartType, setChartType] = useState("bar"); // bar, candle, line, area


  useEffect(() => {
    if (candles !== null) {
      marketData.streamBars(setNewCandle, symbol, {...options, barsback:'1'});
    }
  }, [candles]);



  useEffect(() => {
    if (newCandle !== null && candles !== null && seriesRef?.current){
      const bar = newCandle;
      try {
        seriesRef.current?.update({
          time: bar.Epoch,
          open: bar.Open,
          high: bar.High,
          low: bar.Low,
          close: bar.Close,
          volume: bar.TotalVolume,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [newCandle]);

  useEffect(() => {

    marketData.setCandles(setCandles, symbol, options);

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
        {candles !== null && containerRef.current ? (
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
              <InsertCandles chartRef={seriesRef}
                candles={candles}
                chartType={chartType}
                candleKey={'close'}
                visRange={getVisRange(candles, primaryChartRef)}/>
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
