import React, {useRef, useEffect, useState} from 'react';
// import ta from 'trading-signals';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import LightWeight from '../lightweightcharts/main';
import * as talib from '../lightweightcharts/talib';
import {convertArrayToJsonArrayForChart, csvToJsonArray, indicatorToLineChart} from '../lightweightcharts/util';
import {getAllFunctions, generateLineData, generateCandleData,convertCsvToJson ,jsonArrayToArrayByKey} from '../util';
import {data} from './exampleData';
import {IconEye, IconEyeSlash, IconFlask} from '../Icons';
import Slide from '@mui/material/Slide';


function Chart() {
  const containerRef = useRef(null);
  const chartHeaderRef = useRef(null);
  const chartLegendRef = useRef(null);
  const chartBodyRef = useRef(null);
  const chartFooterRef = useRef(null);
  const [showStudy, setShowStudy] = useState(false);


  useEffect(() => {
    console.log(getAllFunctions(talib));
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

    const emas = [5, 10, 25, 50];
    emas.forEach((n) => {
      var emaArray = talib.getEMA(jsonArray, n);
      lwc.addChartStudy(
        {pre: '$', post: '', type: 'line', title: `EMA (${n})`, data: indicatorToLineChart(jsonArray, emaArray) },
        {color: `rgb(${225 - n}, ${n}, ${25+n})`, lineWidth: 2,});
    });


    lwc.chartResize(containerRef.current.clientWidth, chartHeight);

    lwc.addCrosshairListener();

    const listenerResize = () => {lwc.chartResize(containerRef.current.clientWidth, chartHeight)}
    window.addEventListener('resize', listenerResize);
    return () => {
      window.removeEventListener('resize', listenerResize);
      lwc.kill();
    };
  }, []);

  const toggleStudies =() => {
    setShowStudy(!showStudy);
  }

  return (
    <>
      <div className="py-2 bg-discord-darkestGray border border-discord-black rounded shadow-lg"
        ref={containerRef}>
        <div ref={chartHeaderRef} className="mx-2 pb-2 border-b border-discord-black">
          <button className={`border-b-2 border-[${showStudy ? 'discord-white' : 'rgba(0,0,0,0.0)'}] hover:border-discord-blurple hover:text-discord-blurple px-2 py-[4px]`} onClick={toggleStudies}><IconFlask/></button>
        </div>
        <div className="relative" ref={chartLegendRef}></div>
        <div className="relative" ref={chartBodyRef}>
            <Slide  direction="down" in={showStudy} mountOnEnter unmountOnExit >
              <div className="p-2 z-[9999] ml-2 mt-[4px] absolute inset-0 rounded border-discord-black border shadow-lg bg-discord-black h-[200px] scroll-container overflow-y-auto max-w-[300px]">
                {

                }
              </div>
            </Slide>
        </div>
        <div ref={chartFooterRef}></div>
      </div>
    </>
  );
};

export default Chart;
