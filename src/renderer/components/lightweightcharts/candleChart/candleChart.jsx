import React, { useEffect, useState, useRef } from "react";
import * as talib from "../talib";
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
  getMarketOpenStatus
} from "../util";
import { isStringInArray,
  isSubStr,
  getAllFunctions,
  getRandomRGB,
  findObjectById,
  inArray } from "../../../tools/util";
import {
  IconFlask,
  IconFlaskVial,
  IconCandleChart,
  IconBarChart,
  IconAreaChart,
  IconLineChart,
  IconSearch,
  IconWallet,
  IconX,
  IconClock
} from "../../../api/Icons";
import AreaChartType from './areaChartType';
import InsertVolume from './insertVolume';
import InsertCandles from './insertCandles';
import ChartLegend from './legend';
import InsertChartHeader from './insertChartHeader';
import Exthrs from './insertExtHrs';
import axios from 'axios';

export default function CandleChart({ preloadSymbol, accountId, symbolOptions, symbolCallback }) {
  const marketData = window.ts.marketData;
  const account = window.ts.account;
  const containerRef = useRef(null);

  // Chart Component
  const volumeRef = useRef(null);
  const primaryChartRef = useRef(null);
  const chartHeight = 400;
  const [chartWidth, setChartWidth] = useState(800);
  const [chartType, setChartType] = useState("candle"); // bar, candle, line, area
  const seriesRef = useRef(null); // tied to specfic series type
  const [crosshairIndex, setCrosshairIndex] = useState(0);
  // SeriesData
  const [data, setData] = useState(null);
  const [candles, setCandles] = useState(null);
  const [newCandle, setNewCandle] = useState(null);
  // const [extHrs, setExtHrs] = useState(symbolOptions?.sessiontemplate === 'Default' ? true : false);
  // Symbol
  const [options, setOptions] = useState(symbolOptions);
  const [symbol, setSymbol] = useState(preloadSymbol);
  const [searchInput, setSearchInput] = useState(preloadSymbol);
  const [symbolDetails, setSymbolDetails] = useState(null);
  // for daily markers
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderHistoryInterval, setOrderHistoryInterval] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
    marketData.allStreams = [];
    marketData.setSymbolDetails(setSymbolDetails, symbol);
    marketData.setCandles(setCandles, symbol, options);
    account.setOrdersBySymbol(setOrderHistory, symbol, accountId);
    if (typeof symbolCallback !== 'undefined'){
      symbolCallback(symbol);
    }
    if (accountId != null || accountId !== undefined) {
      if (orderHistoryInterval !== null) {
        clearInterval(orderHistoryInterval);
      }
      account.setOrdersBySymbol(setOrderHistory, symbol, accountId);
      const interval = setInterval(() => {
        if (accountId != null || accountId !== undefined) {
          account.setOrdersBySymbol(setOrderHistory, symbol, accountId);
        }
      }, 30000);
      setOrderHistoryInterval(interval);
    }
    return () => {
      if (orderHistoryInterval !== null) {
        clearInterval(orderHistoryInterval);
      }
    }
  }, [symbol, options]);

  useEffect(() => {
    if (candles !== null) {
      setData(candles);
      marketData.allStreams = [];
      if (getMarketOpenStatus() !== 'Closed'){
        marketData.streamBars(setNewCandle, symbol, {...options, barsback:'1'});
      }
    }
  }, [candles]);

  useEffect(() => {
    if (newCandle !== null && candles !== null && seriesRef?.current){
      if (typeof newCandle?.Heartbeat === 'undefined') {
        const bar = newCandle;
        try {
            marketData.updateCandle(seriesRef, newCandle);
            // marketData.updateVolume(volumeRef, newCandle, chartColors.softGreen, chartColors.softBlurple);
            setData(prevData =>
              prevData[prevData.length-1].time !== marketData.formatBar(newCandle).time ?
              [...prevData, marketData.formatBar(newCandle)] : [...prevData]);
          } catch (error) {
          console.error(error);
        }
      } else{
        console.log("Stream heartbeat", newCandle?.Heartbeat);
      }
    }
  }, [newCandle]);

  useEffect(() => {
    if (data !== null) {
      if (data.length > candles.length) {
        try {
          marketData.setCandles(setCandles, symbol, options);
        } catch (error) {
          console.error(`Setting new candles - ${error}`);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (searchInput !== null  || searchInput.trim() !== "") {
      setSymbol(searchInput);
    }
  }, [searchInput]);

  const crosshairAction = (e) => {
    if (primaryChartRef.current) {
      try {
        const currentIndex = candles.findIndex(obj => obj.time === e.time || obj.time === candles[candles.length-1].time);
        setCrosshairIndex(currentIndex);
      } catch (error) {
        console.error(`Setting Crosshair Index - ${error}`);
      }
    }
  };

  return (
    <>
      <div ref={containerRef} className="grow relative min-w-[300px] sm:w-[100%]">
        <div className={`w-full h-[${chartHeight}px] bg-discord-darkestGray rounded py-2`}>
        {candles !== null && containerRef.current && symbolDetails !== null ? (
          <>
            <InsertChartHeader
            chartTypeCallback={setChartType}
            chartType={chartType}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            />
            <ChartLegend
              symbolName={`${symbol}${symbolDetails[0]?.Exchange ? `:${symbolDetails[0]?.Exchange}` : ''}`}
              candles={data}
              chartref={primaryChartRef}
              moveindex={crosshairIndex}/>
            <Chart
              ref={primaryChartRef}
              onCrosshairMove={crosshairAction}
              {...defaultChartOptions({ width: chartWidth, height: chartHeight - 40 })}>
              <InsertVolume volumeRef={volumeRef} candles={candles}/>
              <InsertCandles chartRef={seriesRef}
                candles={candles}
                orderHistory={orderHistory}
                chartType={chartType}
                candleKey={'close'}
                visRange={getVisRange(candles, primaryChartRef)}/>
            </Chart>
            {/* extHours */}
            <Exthrs options={options} setOptions={setOptions}/>
            </>
          ) : (
            <span className="text-center">Loading...</span>
          )}
        </div>
      </div>
    </>
  );
}
