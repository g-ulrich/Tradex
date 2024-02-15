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
  inArray,
  removeDupsFromJsonArr,
  inJsonArray } from "../../../tools/util";
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
import IsStreaming from '../../../pages/Equities/isStreaming';
import AreaChartType from './areaChartType';
import InsertVolume from './insertVolume';
import InsertCandles from './insertCandles';
import ChartLegend from './legend';
import InsertChartHeader from './insertChartHeader';
import Exthrs from './insertExtHrs';


export default function CandleChart({ preloadSymbol, accountId, symbolOptions, symbolCallback }) {
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
  // const [data, setData] = useState(null);
  const [candles, setCandles] = useState(null);
  // const [newCandle, setNewCandle] = useState(null); // accumulated candle from bar data
  const [newBar, setNewBar] = useState(null); // incoming unformated bar
  const streamId = "e_"
  // const [extHrs, setExtHrs] = useState(symbolOptions?.sessiontemplate === 'Default' ? true : false);
  // Symbol
  const [options, setOptions] = useState(symbolOptions);
  const [prevSymbol, setPrevSymbol] = useState(null);
  const [symbol, setSymbol] = useState(preloadSymbol);
  const [searchInput, setSearchInput] = useState(preloadSymbol);
  const [symbolDetails, setSymbolDetails] = useState(null);
  // for daily markers
  const [streamOrders, setStreamOrders] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderHistoryInterval, setOrderHistoryInterval] = useState(null);

  useEffect(() => {
    if (accountId !== null) {
      window.ts.account.streamOrders(setStreamOrders, streamId, accountId)
    }

    const resizeWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth - 20);
      }
    };
    resizeWidth();
    window.addEventListener("resize", resizeWidth);
    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
    return()=>{
      window.ts.account.killAllStreamsById(streamId);
    }
  }, []);


  useEffect(() => {
    if (streamOrders !== null){
      console.log("candleChart stream orders", streamOrders);
    }
  }, [streamOrders]);

  useEffect(() => {
    if (prevSymbol !== null) {
      window.ts.marketData.killAllStreamsById(streamId);
    }
    setNewBar(null);
    if (getMarketOpenStatus() !== 'Closed'){
      window.ts.marketData.streamBars(setNewBar, streamId, symbol, {...options, barsback:'1'});
    }
  }, [symbol]);


  useEffect(() => {
    const newSymbol = searchInput;

    if (symbolCallback){
      // for main equities page
      symbolCallback(newSymbol);
    }

    // setup candles for new symbol
    window.ts.marketData.setSymbolDetails(setSymbolDetails, symbol);
    window.ts.marketData.setCandles(setCandles, newSymbol, options);

    // Poll order history by symbol for day
    if (accountId) {
      if (orderHistoryInterval !== null) {
        clearInterval(orderHistoryInterval);
      }
      window.ts.account.setOrdersBySymbol(setOrderHistory, newSymbol, accountId);
      const interval = setInterval(() => {
        if (accountId) {
          window.ts.account.setOrdersBySymbol(setOrderHistory, newSymbol, accountId);
        }
      }, 10000);
      setOrderHistoryInterval(interval);
    }

    // set new symbol and prev and remove streamBar - newBar
    setPrevSymbol(symbol);
    setSymbol(newSymbol);
    setNewBar(null);

    return () => {
      if (orderHistoryInterval !== null) {
        clearInterval(orderHistoryInterval);
      }
    }
  }, [searchInput, options]);


  useEffect(() => {
    if (newBar !== null && candles !== null && seriesRef?.current){
      if (typeof newBar?.Heartbeat === 'undefined') {
        try {
            const formatedBar = window.ts.marketData.formatBar(newBar);
            if (symbol !== prevSymbol){
              // var updatedCandle = {};
              // if (newCandle !== null){
              //   updatedCandle = {...newCandle,...formatedBar};
              // } else {
              //   updatedCandle = formatedBar;
              // }
              // setNewCandle(updatedCandle);
              seriesRef.current?.update(formatedBar);
              // marketData.updateVolume(volumeRef, formatedBar, chartColors.softGreen, chartColors.softBlurple);
              if (candles[candles.length-1].time < formatedBar.time){
                console.log("updating candles oldbar", candles[candles.length-1],"update bar", formatedBar);
                // setCandles((prev)=>[...prev, updatedCandle]);
                const candleCallback = (data) =>{
                  setCandles(prev=>removeDupsFromJsonArr(data, 'time'));
                }
                window.ts.marketData.setCandles(candleCallback, symbol, options);

                // setNewCandle(null);
              }
            }else {
              // setNewCandle(null);
            }
          } catch (error) {
          console.error("newBar", error);
        }
      } else{
        console.log("Stream heartbeat", newBar?.Heartbeat);
      }
    }
  }, [newBar]);


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
      <div ref={containerRef} className="row relative p-0 m-0">
        <div className={`col-12 p-0 m-0 h-[${chartHeight}px] bg-discord-darkestGray rounded border border-discord-black`}>
        {candles !== null && containerRef.current && symbolDetails !== null && prevSymbol !== symbol ? (
          <>
            <div className="absolute right-2 top-2 text-lg ">
              <IsStreaming symbol={symbol} streamId={streamId}/>
            </div>
            <InsertChartHeader
            chartTypeCallback={setChartType}
            chartType={chartType}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            />
            {
              candles !== null ? (
              <>
              <ChartLegend
                symbolName={`${symbol}${symbolDetails[0]?.Exchange ? `:${symbolDetails[0]?.Exchange}` : ''}`}
                candles={removeDupsFromJsonArr(candles, 'time')}
                chartref={primaryChartRef}
                moveindex={crosshairIndex}/>
              </>
              ) : (<></>)
            }
            <Chart
              ref={primaryChartRef}
              onCrosshairMove={crosshairAction}
              {...defaultChartOptions({ width: chartWidth, height: chartHeight - 40 })}>
              <InsertVolume volumeRef={volumeRef} candles={candles}/>
              <InsertCandles chartRef={seriesRef}
                candles={removeDupsFromJsonArr(candles, "time")}
                orderHistory={orderHistory}
                chartType={chartType}
                candleKey={'close'}
                visRange={getVisRange(candles, primaryChartRef)}/>
            </Chart>
            {/* extHours */}
            <div className="float-right absolute bottom-0 right-2">
              <Exthrs options={options} setOptions={setOptions}/>
            </div>
            </>
          ) : (
            <span className="text-center">Loading...</span>
          )}
        </div>
      </div>
    </>
  );
}
