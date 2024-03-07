import React, { useEffect, useState, useRef } from "react";

import {
  Chart,
  LineSeries
} from "lightweight-charts-react-wrapper";
import {
  IconClock,
} from '../../../api/Icons';
import {
  getWaterMark,
  getFullSymbolName,
  crosshairAction,
  addStudyCallback
} from '../util';
import {currentESTTime,
  getDateNDaysAgo,
  isSubStr,
  isFloat,
  getRandomRGB} from '../../../tools/util';
import {grpChartOptions} from '../options';
import ResizeChartWidth from '../resizeChartWidth';
import GetChartRange from '../getChartRange';
import InsertVolume from './insertVolume';
import InsertCandles from './insertCandles';
import SymbolSearchInput from '../symbolSearchInput';
import ChartTypeSelector from '../chartTypeSelector';
import FrequencySelection from '../frequencySelector';
import PrimaryChartLegend from '../primaryChartLegend';
import SubsequentChart from './subsequentChart';
import IndicatorsBtn from "../indicatorsBtn";

export default function CandleChart({ preloadSymbol, accountId, symbolOptions, symbolCallback }) {
  const containerRef = useRef();
  // Symbol specifications
  const [symbol, setSymbol] = useState(preloadSymbol);
  const [symbolDetails, setSymbolDetails] = useState(null);
  // Data

  const candlesRef = useRef();
  const candles2Ref = useRef();
  const [candles, setCandles] = useState([]);
  const [lastUpdate, setlastUpdate] = useState(currentESTTime());
  const [options, setOptions] = useState(symbolOptions);
  const [todaysOrderHistory, setTodaysOrderHistory] = useState([]);
  const [allOrderHistory, setAllOrderHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  // studies
  const [chartStudies, setChartStudies] = useState([]);
  // Chart analytics
  const chart1Ref = useRef();
  const chart2Ref = useRef();
  const vol1Ref = useRef();
  const chartHeight = 400;
  const [chartType, setChartType] = useState("candle"); // bar, candle, line, area
  const [chartWidth] = ResizeChartWidth(containerRef, 500); // Pass initial width
  const [timeScalerange, rangeById, isProfiting] = GetChartRange(chart1Ref, candles, 'close');
  const [index1, setIndex1] = useState(0);


  useEffect(()=>{
    setChartStudies(prev=>[]);
    window.ts.marketData.setSymbolDetails(setSymbolDetails, symbol);
    window.ts.account.setOrdersBySymbol(setTodaysOrderHistory, symbol, accountId);
    window.ts.account.setHistoricalOrders(setAllOrderHistory, accountId, getDateNDaysAgo(7));
    setCandles(prev=>[]);
    setTimeout(() => {
      window.ts.marketData.setCandles(setCandles, symbol, options);
      setlastUpdate(currentESTTime());
    }, 500);
    const loop = setInterval(() => {
      window.ts.marketData.setCandles(setCandles, symbol, options);
      window.ts.account.setOrdersBySymbol(setTodaysOrderHistory, symbol, accountId);
      setlastUpdate(currentESTTime());
    }, 10000);
    console.log("options", options);
    return () => {
      clearInterval(loop);
    }
  }, [symbol, options]);



  // useEffect(() => {
  //   if (timeScalerange && candles.length > 0){
  //       const chartRange1 = chart2Ref.current.timeScale();
  //       chartRange1.setVisibleRange(timeScalerange);
  //       const chartRange2 = chart1Ref.current.timeScale();
  //       chartRange2.setVisibleRange(timeScalerange);

  //   }
  //  }, [timeScalerange]);


  const extHrsBtn = () => {
    return (
      <button
        className={`mr-2 text-white rounded-sm px-2 py-[3px] hover:underline bg-discord-darkerGray `}
        onClick={()=>{
        setOptions({...options, sessiontemplate: options.sessiontemplate === 'Default' ? 'USEQ24Hour' : 'Default'
        })}}> <IconClock/> {' ' + options.sessiontemplate}
      </button>
    );
  };




  // useEffect(() => {
  //   console.log(chartStudies);
  // }, [chartStudies]);



  return (
    <>
      <div ref={containerRef}  className="py-2 bg-discord-darkestGray rounded-sm">
        {/* header */}
        <div className="flex px-1 gap-2 items-center">
          <SymbolSearchInput setSymbol={setSymbol} marketType={'Equities'}/>
          <ChartTypeSelector chartType={chartType} setChartType={setChartType}/>
          <FrequencySelection options={options} setOptions={setOptions}/>
          <IndicatorsBtn addStudyCallback={(obj, rgb, vars)=>{addStudyCallback(setChartStudies, candles, obj, rgb, vars) }}/>
          <span className="grow pr-1 text-gray-500 text-right">
            {extHrsBtn()}{lastUpdate}
          </span>
        </div>
        {/* Legends */}
        <PrimaryChartLegend
          symbolName={getFullSymbolName(symbol, symbolDetails)}
          candles={candles}
          chartref={chart1Ref}
          moveindex={index1}/>
        {/* Charts */}
        <Chart
          watermark={getWaterMark(getFullSymbolName(symbol, symbolDetails))}
          ref={chart1Ref}
          onCrosshairMove={(e)=>{crosshairAction(setIndex1, chart1Ref, candles, e)}}
          {...grpChartOptions({ width: chartWidth, height: chartHeight, timeVisible: false})}>
            <InsertVolume volumeRef={vol1Ref} candles={candles}/>
            <InsertCandles chartRef={candlesRef}
              candles={candles}
              orderHistory={allOrderHistory.concat(todaysOrderHistory)}
              chartType={chartType}
              candleKey={'close'}
              isProfiting={isProfiting}/>

              {
              chartStudies.length > 0 ? (
                  <>
                    {
                      chartStudies.map((obj, i) => (
                        <LineSeries
                          key={i} // It's important to provide a unique key for each child in a list
                          data={obj.data}
                          color={obj.color}
                          lineWidth={2}
                        />
                      ))
                    }
                  </>
              ) : (<></>)
              }

        </Chart>
        {/* <PrimaryChartLegend
          symbolName={getFullSymbolName(symbol, symbolDetails)}
          candles={candles}
          chartref={chart2Ref}
          moveindex={index1}/> */}
        {/* <Chart
          watermark={getWaterMark(getFullSymbolName(symbol, symbolDetails))}
          ref={chart2Ref}
          onCrosshairMove={(e)=>{crosshairAction(setIndex1, chart2Ref, candles, e)}}
          {...grpChartOptions({ width: chartWidth, height: 100, timeVisible: true })}>
            <InsertCandles chartRef={candles2Ref}
              candles={candles}
              orderHistory={[]}
              chartType={'line'}
              candleKey={'close'}
              isProfiting={isProfiting}/>

        </Chart> */}
      </div>
    </>
  );

};
