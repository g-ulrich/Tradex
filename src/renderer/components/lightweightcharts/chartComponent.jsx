import React, {useRef, useEffect, useState} from 'react';
// import ta from 'trading-signals';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import LightWeight from '../lightweightcharts/main';
import {getEMA} from '../lightweightcharts/talib';
import {convertArrayToJsonArrayForChart, csvToJsonArray, indicatorToLineChart} from '../lightweightcharts/util';
import {generateLineData, generateCandleData,convertCsvToJson ,jsonArrayToArrayByKey} from '../util';
import {data} from './exampleData';

function Chart() {
  const containerRef = useRef(null);
  const chartHeaderRef = useRef(null);
  const chartLegendRef = useRef(null);
  const chartBodyRef = useRef(null);
  const chartFooterRef = useRef(null);

  useEffect(() => {
    const chartHeight = 500;
    const lwc = new LightWeight({
      ref: {container: containerRef.current,
            header: chartHeaderRef.current,
            legend: chartLegendRef.current,
            body: chartBodyRef.current,
            footer: chartFooterRef.current,},
      width: containerRef.current.clientWidth,
      height: chartHeight
    });

    const jsonArray = csvToJsonArray(data);

    lwc.addChartStudy(
      {pre: '$', post: '',type: 'candle', title: 'OHLC', data: jsonArray },
      {color: 'rgb(225, 0, 70)'});

    lwc.addVolume(jsonArray);

    const emaArray = getEMA(jsonArray, 25);

    lwc.addChartStudy(
      {pre: '$', post: '', type: 'line', title: 'EMA25', data: indicatorToLineChart(jsonArray, emaArray) },
      {color: 'rgb(0, 0, 70)'});


    lwc.chartResize(containerRef.current.clientWidth, chartHeight);

    lwc.addCrosshairListener();
    const listenerResize = () => {lwc.chartResize(containerRef.current.clientWidth, chartHeight)}
    window.addEventListener('resize', listenerResize);
    return () => {
      window.removeEventListener('resize', listenerResize);
      lwc.kill();
    };
  }, []);
  return (
    <>
      <div className="py-2 bg-discord-darkestGray border border-discord-black rounded shadow-lg"
        ref={containerRef}>
        <div ref={chartHeaderRef}></div>
        <div className="relative" ref={chartLegendRef}></div>
        <div ref={chartBodyRef}></div>
        <div ref={chartFooterRef}></div>
      </div>
    </>
  );
};

export default Chart;
