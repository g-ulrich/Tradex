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
  IconX
} from "../../../api/Icons";
import AreaChartType from './areaChartType';
import InsertVolume from './insertVolume';
import InsertCandles from './insertCandles';
import ChartLegend from './legend';
import InsertChartHeader from './insertChartHeader';
import axios from 'axios';

export default function CandleChart({ symbol, options, orderHistory }) {
  const marketData = window.ts.marketData;
  const containerRef = useRef(null);
  const seriesRef = useRef(null);
  const volumeRef = useRef(null);
  const primaryChartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [data, setData] = useState(null);
  const [candles, setCandles] = useState(null);
  const [newCandle, setNewCandle] = useState(null);
  const [symbolDetails, setSymbolDetails] = useState(null);
  const [showStudy, setShowStudy] = useState(false);
  const [crosshairIndex, setCrosshairIndex] = useState(0);
  const [chartStudies, setChartStudies] = useState([]);
  const [searchQuery, setSearchQuery] = useState(symbol);
  const [chartType, setChartType] = useState("candle"); // bar, candle, line, area
  const chartHeight = 600;

  useEffect(() => {
    marketData.setSymbolDetails(setSymbolDetails, symbol);
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

  useEffect(() => {
    if (candles !== null) {
      setData(candles);
      marketData.killAllStreams();
      marketData.streamBars(setNewCandle, symbol, {...options, barsback:'1'});
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
          setCandles(prevCandles=>data);
        } catch (error) {
          console.error(`Setting new candles - ${error}`);
        }
      }
    }
  }, [data]);

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
            <InsertChartHeader chartTypeCallback={setChartType} chartType={chartType}/>
            <ChartLegend
              symbolName={`${symbol}${symbolDetails[0]?.Exchange ? `:${symbolDetails[0]?.Exchange}` : ''}`}
              candles={data} chartref={primaryChartRef}
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
            </>
          ) : (
            <span className="text-center">Loading...</span>
          )}
        </div>
      </div>
    </>
  );
}
