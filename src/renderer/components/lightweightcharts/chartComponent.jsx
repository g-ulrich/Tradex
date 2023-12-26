import React, {useRef, useEffect, useState} from 'react';
// import ta from 'trading-signals';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import LightWeight from '../lightweightcharts/main';
import * as talib from '../lightweightcharts/talib';
import {convertArrayToJsonArrayForChart, csvToJsonArray, indicatorToLineChart} from '../lightweightcharts/util';
import {getAllFunctions, generateLineData, generateCandleData,convertCsvToJson ,jsonArrayToArrayByKey, isSubStr} from '../util';
import {data} from './exampleData';
import {IconEye, IconEyeSlash, IconFlask, IconAdd} from '../Icons';
import Slide from '@mui/material/Slide';


function Chart() {
  const containerRef = useRef(null);
  const chartHeaderRef = useRef(null);
  const chartLegendRef = useRef(null);
  const chartBodyRef = useRef(null);
  const chartFooterRef = useRef(null);
  const [showStudy, setShowStudy] = useState(false);
  const [talibFuncs, setTalibFuncs] = useState(getAllFunctions(talib));
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    // setTalibFuncs(getAllFunctions(talib));
    console.log(talibFuncs);
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

  const addStudy = (obj) => {
    const params = obj.parameters;
    params.forEach((item) => {
      if (item !== 'obj') {
        var ele = document.getElementById(`${obj.name}_${item}`);
        console.log(item, ele.value);
      }
    });

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
              <div className="p-2 z-[9999] ml-2 mt-[4px] absolute inset-0 rounded border-discord-black border shadow-lg bg-discord-black max-h-[300px] min-h-[100px] scroll-container overflow-y-auto max-w-[400px]">
                <div className="text-lg"><IconFlask/> Indicators ({talibFuncs.length})

                <input
                  type="text"
                  placeholder="Search ..."
                  className="ml-2 px-2 py-[4px] border border-discord-darkestgray bg-discord-darkestGray rounded text-discord-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                </div>
                {talibFuncs.map((obj, i) => {
                  if (isSubStr(obj.name, 'get') && isSubStr(obj.name, searchQuery)) {
                    return (
                      <div key={i} className="flex border-b border-gray-600 items-center">
                        <div className="flex items-center justify-start">
                          <button onClick={() => addStudy(obj)}
                            className="mr-2 my-[4px] px-2 py-[4px] border border-discord-softGreen hover:bg-discord-softGreen rounded text-discord-softGreen hover:text-discord-white">
                            <IconAdd/></button>
                          {obj.name.replace('get', '')}</div>
                        <div className="grow  justify-end">
                          {obj.parameters.map((item, j) => {
                            if (item !== 'obj') {
                              return (
                                <div key={j} className="float-right flex pl-2 justify-end"><b className="">{item}</b>-
                                  <input id={`${obj.name}_${item}`} type="number" class="border border-discord-darkestgray bg-discord-darkestGray px-[4px]  rounded w-[45px]" step="1" min="2" max="500"></input>
                                </div>
                              )
                            }
                          }
                          )}
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                  })}
              </div>
            </Slide>
        </div>
        <div ref={chartFooterRef}></div>
      </div>
    </>
  );
};

export default Chart;
